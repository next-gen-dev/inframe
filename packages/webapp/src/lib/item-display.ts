import { IconDef } from "./icon-def";

export interface ItemDisplay {
    title: string;
    id: string;
    image?: IconDef;
    redacted?: boolean;
}
