import { resolve } from "path";
import { isPromise } from "util/types";
import "dotenv/config";

const filepath = process.argv[process.argv.length - 2];
const exportName = process.argv[process.argv.length - 1];

async function main() {
    const imported = await import(resolve(filepath));
    const a = imported[exportName];
    if (typeof a === "function") {
        const result = await a();
        console.log(JSON.stringify(result));
    } else if (isPromise(a)) {
        const result = await a;
        console.log(JSON.stringify(result));
    } else {
        console.log(JSON.stringify(a));
    }
}

main().catch(console.error);
