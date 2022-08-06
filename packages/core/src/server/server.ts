// Given an input folder
// Get a tree of files
// Ignore files that begin in "_"
// For each of those files
//      Add the file to the API and to the list of items
// Once the API is called
//      Is it in the list of files?
//      Call the default function (no params, no secrets at first)

import { Express, json } from "express";
import { Observable, shareReplay } from "rxjs";
import express from "express";
import cors from "cors";
import { FileItem, StoredConnection } from "@inframe/common";

export { StoredConnection };
export * from "../integrations/files/files";

import { readdir, stat } from "fs/promises";
import { join } from "path";
import { execFileExported, trySync } from "../integrations/files/files";
import handler from "serve-handler";
import webAppBuildPath from "@inframe/web";

const port = parseInt(process.env.PORT ?? "") || 8081;

function urlJoin(a: string, b: string) {
    return [a, b].filter((v) => v !== "").join("/");
}

const SUPPORTED_EXTENSION_REGEX = [/\.ts$/];
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

export async function dirItems(root: string, path: string = "") {
    // TODO: normalize path?
    const files = await readdir(join(root, path));
    const items = files
        .filter(
            (file) =>
                !file.startsWith("_") &&
                !file.endsWith(".d.ts") &&
                SUPPORTED_EXTENSION_REGEX.some((regex) => file.match(regex)),
        )
        .map(
            (filename): FileItem => ({
                isDir: true,
                name: filename.replace(/\.[a-z0-9]+$/, ""),
                path: urlJoin(path, filename).replace(/\.[a-z0-9]+$/, ""),
            }),
        );
    return items;
}

async function exists(file: string) {
    try {
        const info = await stat(file);
        return true;
    } catch (e) {
        return false;
    }
}

export interface ServerOptions {
    sync?: boolean;
}

export function createServer(
    directory: string,
    { sync = true }: ServerOptions = {},
): Observable<Express> {
    return new Observable<Express>((subscriber) => {
        const app = express();

        app.use(cors());

        app.use(json());

        app.get("/data/files", async (req, res) => {
            const items = await dirItems(directory);
            res.send(items);
        });

        app.get("/data/files/*", async (req, res) => {
            try {
                console.log(req.path);
                const filepath = req.path
                    .replace(/^\/data\/files\/?/, "")
                    .replace(/\/$/, "");

                const isJs = await exists(join(directory, `${filepath}.js`));
                const isTs = await exists(join(directory, `${filepath}.ts`));

                const isFile = isJs || isTs; // filepath.match(/\.[a-z]+$/)

                // If it's a file
                if (isFile) {
                    // replace the end of filepath to get the actual path
                    // const slashIndex = filepath.lastIndexOf("/");
                    // const importedFile = filepath.substring(0, slashIndex);
                    // const call = filepath.substring(slashIndex + 1);

                    // TODO: don't fallback to js
                    const ext = isTs ? "ts" : "js";
                    const result = await execFileExported(
                        join(directory, `${filepath}.${ext}`),
                        "default",
                        directory,
                    );
                    //
                    res.send(result);
                    return;
                }

                const isDir = await exists(join(directory, filepath));
                // If it's a dir, return the children
                if (isDir) {
                    const items = await dirItems(directory, filepath);
                    res.send(items);
                    return;
                }

                // If it's a function, import that file, call that function, and display the results
                // if (filepath.match(/\.[a-z]+\/[^/]+$/)) {
                //     // replace the end of filepath to get the actual path
                //     const slashIndex = filepath.lastIndexOf("/");
                //     const importedFile = filepath.substring(0, slashIndex);
                //     const call = filepath.substring(slashIndex + 1);
                //     const result = await execFileExported(
                //         join(directory, importedFile),
                //         call,
                //     );
                //     //
                //     res.send(result);
                //     return;
                // }

                // If it's a file, return the exported functions and consts
                // const exported: string[] = await getFileExportedNames(
                //     join(directory, filepath),
                // );
                // const items = exported.map(
                //     (filename): FileItem => ({
                //         isDir: true,
                //         name: filename,
                //         path: `${filepath}/${filename}`,
                //     }),
                // );
                // res.send(items);

                res.sendStatus(404);
                return;
            } catch (e) {
                console.error(e);
                res.sendStatus(500);
            }
        });

        app.get("*", (req, res) => {
            return handler(req, res, {
                public: webAppBuildPath,
                rewrites: [{ source: "**", destination: "/index.html" }],
            });
        });

        const server = app.listen(port, () => {
            console.log(`Running at http://localhost:${port}`);
            subscriber.next(app);
        });

        // TODO: sync every few minutes
        async function runSync() {
            console.log("Syncing...");
            // For each file
            const items = await dirItems(directory);
            // Try sync
            for (let item of items) {
                const result = await trySync(
                    join(directory, item.path),
                    "default",
                    directory,
                );
                if (result) {
                    console.log(`Synced "${item.path}"`);
                }
            }
        }
        const syncInterval = !sync
            ? undefined
            : setInterval(() => {
                  runSync();
              }, 10 * MINUTES);
        if (sync) {
            runSync();
        }

        return () => {
            server.close();
            if (syncInterval !== undefined) {
                clearInterval(syncInterval);
            }
        };
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
}
