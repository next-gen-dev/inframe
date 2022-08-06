import dev from "./dev";

export const cli = async () => {
    const [, , ...args] = process.argv;

    try {
        switch (args[0]) {
            case "dev":
                await dev(args.slice(1));
            default:
                await dev(args);
        }
    } catch (e) {
        throw e;
    }
};
