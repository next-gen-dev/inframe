import { IconDef } from "./icon-def";
export * from "./icon-def";

export * from "./file-types";

export interface ItemDisplay {
    title: string;
    id: string;
    image?: IconDef;
}

export interface ResolvableInfo {
    type: string;
    params?: string[];
}

export interface NewConnectionDefinition {
    display: ItemDisplay;
    resolvableType: string;
}

export interface StoredConnection {
    id: string;
    resolvable: ResolvableInfo;
    display: ItemDisplay;
}
