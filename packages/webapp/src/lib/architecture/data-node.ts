import { Observable } from "rxjs";
import { ActionIcon } from "../../components/utils/ActionIcons";
import { titleCase } from "../../utils/text-format";
import { ItemDisplay } from "../item-display";

export type Transformer<T, R> = (input: T) => R;

export interface Lenses<T> {
    listItem: Transformer<T, ItemDisplay>;
    id: Transformer<T, string>;
    // dataNode?: Transformer<T,
}

export interface DataNode<T = any> {
    lenses: Lenses<T>;
    data: T; // Observable
    // type? is this a lenses property?
    // schema? is this a lenses property?
    schema?: DataType;
    // relationships?
    // id?
    value?: Observable<any>;
    children?: Observable<DataNode[]>;
    actionIcons?: ActionIcon[];
}

export interface DataProp {
    name: string;
    key: string;
    type?: DataType;
}

export interface DataTypeBase {
    id?: string;
    name?: string;
}

export interface DataObjectType extends DataTypeBase {
    type: "object";
    properties: DataProp[];
}

export interface DataTableType extends DataTypeBase {
    type: "array";
    items?: DataType;
}

export type DataType = DataObjectType | DataTableType;

export function isDataNode(obj: any): obj is DataNode<any> {
    return typeof obj === "object" && obj && "lenses" in obj && "data" in obj;
}

export function schemaReader(obj: any): DataType | undefined {
    if (Array.isArray(obj)) {
        return { type: "array", items: schemaReader(obj[0]) };
    }
    if (obj && typeof obj === "object") {
        return {
            type: "object",
            properties: Object.keys(obj).map((key) => ({
                key,
                name: titleCase(key),
                type: schemaReader(obj[key]),
            })),
        };
    }
    return undefined;
}

export interface ListNode<T> {
    commonSchema: any;
    data: T[]; // Observable
}
