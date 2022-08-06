import { resolve } from "path";
import { isPromise } from "util/types";
import "dotenv/config";

const filepath = process.argv[process.argv.length - 2];
const exportName = process.argv[process.argv.length - 1];

async function getResult(imported: any) {
    const a = imported[exportName];
    if (typeof a === "function") {
        return a();
    } else if (isPromise(a)) {
        return a;
    } else {
        return a;
    }
}

async function main() {
    const imported = await import(resolve(filepath));
    if (typeof imported.sync === "function") {
        const result = await getResult(imported);
        await imported.sync(result);
        return true;
    }
    return false;
}

main().then(console.log).catch(console.error);
