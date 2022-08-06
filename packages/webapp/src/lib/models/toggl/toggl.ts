import { apiRoot } from "../../api";
import { colorIcon } from "../../icon-def";
import { ItemDisplay } from "../../item-display";
import { liveRefreshable } from "../../refreshable";
import { redactNumber, REDACT_CONTENT } from "../../../utils/redactor";
import { DataNode, Lenses } from "../../architecture/data-node";
import { EnhancedTimeEntry } from "./toggl-types";

export const togglEntryLenses: Lenses<EnhancedTimeEntry> = {
    id: (entry) => `toggl/${entry.uid}/entry/${entry.id}`,
    listItem: (entry) => ({
        id: `${entry.id}`,
        title:
            entry.description && entry.description.length > 0
                ? entry.description
                : "(no description)",
        image: entry.color ? colorIcon(entry.color) : colorIcon("#CECECE"),
    }),
};

export function togglEntryDataNode(
    entry: EnhancedTimeEntry,
): DataNode<EnhancedTimeEntry> {
    return {
        lenses: togglEntryLenses,
        data: entry,
    };
}

export function togglEntries(apiKey: string) {
    return liveRefreshable(async (): Promise<EnhancedTimeEntry[]> => {
        try {
            const res = await fetch(`${apiRoot}/toggl/time_entries`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });
            const json: EnhancedTimeEntry[] = await res.json();
            json.forEach((entry) => {
                for (let key of Object.keys(entry)) {
                    if (
                        key.endsWith("id") &&
                        key !== "id" &&
                        // @ts-ignore
                        typeof entry[key] === "number"
                    ) {
                        // @ts-ignore
                        entry[key] = redactNumber(entry[key]);
                    }
                }
                if (REDACT_CONTENT) {
                    entry.guid = entry.guid.replaceAll(/./g, "9");
                }
            });
            return json.filter(
                (entry) => entry.description !== "YC Application",
            );
            // const projectIds = json
            //     .map((item) => item.pid)
            //     .filter((v, i, a) => a.indexOf(v) === i);
            // return json.map((entry) => ({
            //     id: `${entry.id}`,
            //     title: entry.description ?? "",
            //     image: entry.color ? colorIcon(entry.color) : undefined,
            // }));
        } catch (e) {
            console.error(e);
            return [];
        }
    });
}
