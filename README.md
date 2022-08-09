# Inframe

`inframe` helps you sync data into your app. Just write a function to get the data, and `inframe` will sync it to your data source. It also provides a neat interface for previewing your data.

<!-- TODO: Screenshot of an example -->

## Usage

### Reading data

First, create a directory with files exporting default functions that return your data:

```ts
// todos.ts
export default async function exampleTodos() {
    const res = await fetch("https://dummyjson.com/todos");
    return (await res.json()).todos;
}
```

Then you just run `npx inframe` in your project's directory, or install the package globally:

```sh
> npm install --global inframe
```

Once that's done, you can run this command inside your project's directory:

```sh
> inframe
```

### Saving data

Once you're happy with the data you have, you can save it to a destination by exporting a `sync` function from your file:

```ts
// todos.ts
import { writeFile } from "fs/promises";
import { parse } from "json2csv";

export default async function exampleTodos() {
    /* ... */
}

export async function sync(items) {
    const csv = parse(items);
    await writeFile("todos.csv", csv, "utf8");
}
```

`inframe` will then sync your data every few minutes.

## Future Work

-   [ ] Stream-based sync
-   [ ] Library of common sources and destinations
-   [ ] Event-driven sync
-   [ ] Monitoring, logs and notifications
-   [ ] Easy deploy to the cloud
-   [ ] Support other file types (py, csv, json)
