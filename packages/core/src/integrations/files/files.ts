import { StoredConnection, emojiIcon } from "@inframe/common";

export const FILES_CONNECTION_ID = "files";

export const storedFilesConnection: StoredConnection = {
    id: FILES_CONNECTION_ID,
    resolvable: {
        type: FILES_CONNECTION_ID,
    },
    display: {
        id: FILES_CONNECTION_ID,
        title: "Files",
        // TODO: support material icons, or hosted SVG
        image: emojiIcon("📁"),
    },
};

export function storedFileTreeConnection(folder: string): StoredConnection {
    return {
        id: FILES_CONNECTION_ID,
        resolvable: {
            type: FILES_CONNECTION_ID,
            params: [folder],
        },
        display: {
            id: FILES_CONNECTION_ID,
            title: "Files",
            // TODO: support material icons, or hosted SVG
            image: emojiIcon("📁"),
        },
    };
}

import { promisify } from "util";
import { exec as execRaw } from "child_process";
import { resolve, join } from "path";

const exec = promisify(execRaw);

export async function getFileExportedNames(filepath: string) {
    // RUN A CUSTOM SCRIPT THAT DOES THAT
    //
    const utilPath = resolve(
        __dirname,
        // join("..", "..", "src", "utils", "read-exports.js"),
        join("utils", "read-exports.js"),
    );
    try {
        const { stdout } = await exec(`node ${utilPath} ${filepath}`);
        const exported: string[] = JSON.parse(stdout.trim());
        return exported.filter((file) => file !== "__esModule");
    } catch (e) {
        // console.error(`Failed to parse: ${filepath}`);
        // console.error(`Util Path: ${utilPath}`);
        // console.log(stdout);
        console.error(e);
        return [];
    }
}

export async function trySync(
    filepath: string,
    name: string,
    root: string,
): Promise<boolean> {
    const utilPath = resolve(__dirname, join("utils", "try-sync"));
    try {
        const command = `ts-node -T -O '{"target": "es2015", "module": "commonjs"}' ${utilPath} ${filepath} ${name}`;
        const { stdout, stderr } = await exec(command, {
            env: { ...process.env },
        });
        try {
            return JSON.parse(stdout.trim());
        } catch (jsonError) {
            console.error("Failed to parse JSON:");
            console.error({ stdout, stderr, command });
        }
    } catch (e) {
        // console.error(`Failed to parse: ${filepath}`);
        // console.error(`Util Path: ${utilPath}`);
        // console.log(stdout);
        console.error(e);
    }
    return false;
}

export async function execFileExported(
    filepath: string,
    name: string,
    root: string,
) {
    // RUN A CUSTOM SCRIPT THAT DOES THAT
    //

    // TODO: don't just fallback to js
    const fileExtension = filepath.match(/\.tsx?$/) ? "ts" : "js";
    const utilPath = resolve(
        __dirname,
        // join("..", "..", "src", "utils", "get-exported.js"),
        join(
            "utils",
            fileExtension === "ts"
                ? "get-exported"
                : `get-exported.${fileExtension}`,
        ),
    );
    const executable = fileExtension === "ts" ? `ts-node` : "node";
    const execFilepath = filepath; //.replace(/\.tsx?$/, "");
    try {
        const command = `${executable} -T -O '{"target": "es2015", "module": "commonjs"}' ${utilPath} ${execFilepath} ${name}`;
        const { stdout, stderr } = await exec(command, {
            env: { ...process.env, INFRAME_ROOT: root },
        });
        try {
            return JSON.parse(stdout.trim());
        } catch (jsonError) {
            console.error("Failed to parse JSON:");
            console.error({ stdout, stderr, command });
        }
    } catch (e) {
        // console.error(`Failed to parse: ${filepath}`);
        // console.error(`Util Path: ${utilPath}`);
        // console.log(stdout);
        console.error(e);
        return undefined;
    }
}
