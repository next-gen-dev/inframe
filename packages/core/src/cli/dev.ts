import { resolve } from "path";
import { createServer } from "../server/server";

export default async function dev(args: string[]) {

    // TODO: use options parsing lib
    const {params, options} = args.reduce(({params, options}, b) => {
        if (b.startsWith('-')) {
            return {params, options: options.concat(b)}
        } else {
            return {params: params.concat(b), options}
        }
    }, {params: new Array<string>(), options: new Array<string>})

    // resolve folder
    const rootDir = params.length >= 1 ? resolve(params[0]) : process.cwd();

    // begin correct server
    // TODO: server as a promise? Change cli to not use promises?
    createServer(rootDir, { sync: !options.includes("--no-sync") }).subscribe();
}
