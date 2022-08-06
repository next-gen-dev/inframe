import { Observable } from "rxjs";

export type TableSchema<T extends string = string> = readonly {
    readonly name: string;
    readonly id: T;
    readonly sort?: boolean;
}[];

export type SchemaFields<T extends TableSchema<string>> = T extends TableSchema<
    infer U
>
    ? U
    : never;

export type TableRow<T extends string = string> = {
    id: string;
    data: { [k in T]: any };
};

export type TableRows<T extends string = string> = TableRow<T>[];

export interface TableDefinition<
    T extends TableSchema<string> = TableSchema<string>,
> {
    schema?: T;
    rows: Observable<TableRows<SchemaFields<T>>>;
}
