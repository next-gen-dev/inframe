import { writeFile } from "fs/promises";
import { parse } from "json2csv";

export default async function exampleTodos() {
    const res = await fetch("https://dummyjson.com/todos");
    return (await res.json()).todos;
}

export async function sync(items) {
    const csv = parse(items);
    await writeFile("todos.csv", csv, "utf8");
}
