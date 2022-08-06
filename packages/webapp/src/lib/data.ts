/**
 * The goal of this file is to define the data structure in the easiest way
 * possible.
 */

import { combineLatest, map, Observable, of, switchMap } from "rxjs";
import { redactString } from "../utils/redactor";
import { rxCache } from "../utils/rx-cache";
import { DataNode } from "./architecture/data-node";
import { liveStringLocalStorage } from "./browser";
import { colorIcon } from "./icon-def";
import { ItemDisplay } from "./item-display";
import {
    notion$,
    notionItemDisplay,
    NotionPage,
    notionPageLenses,
    notionToken,
} from "./models/notion";
import { togglEntries, togglEntryDataNode } from "./models/toggl/toggl";
import { togglWorkspaces } from "./models/toggl/toggl-workspaces";

const notionProjectsId = liveStringLocalStorage["user.notion.projects"];
const togglToken = liveStringLocalStorage["user.toggl.apiKey"];

function formatDuration(seconds: number) {
    // const h = Math.floor(seconds / 60 / 60);
    // const min = Math.floor((seconds / 60) % 60);
    // return `${h}:${min}`;
    return Math.floor(seconds / 60);
}

export const togglEntries$ = togglToken.$.pipe(
    switchMap((token) => (token ? togglEntries(token).$ : of([]))),
);

export const togglWorkspaces$ = togglToken.$.pipe(
    switchMap((token) => (token ? togglWorkspaces(token).$ : of([]))),
);

export const togglDisplayItems$ = togglEntries$.pipe(
    map((entries) => {
        return entries.map((entry) => ({
            id: `${entry.id}`,
            title: entry.description ?? "",
            image: entry.color ? colorIcon(entry.color) : undefined,
        }));
    }),
);

export const togglEntryNodes$ = togglEntries$.pipe(
    map((entries) => {
        return entries.map((entry) => togglEntryDataNode(entry));
    }),
);

export const groupedTogglEntries$ = togglDisplayItems$.pipe(
    map((items) =>
        items
            .filter((item) => !!item)
            .filter(
                (item, i, a) =>
                    item && a.findIndex((j) => j.title === item.title) === i,
            ),
    ),
);

export const togglFlatUiEntries$ = togglEntries$.pipe(
    map((entries) =>
        entries.map((entry) => ({
            id: `${entry.id}`,
            data: {
                ...{
                    id: `${entry.id}`,

                    description: "",
                    duration: 0,
                    stop: "",
                    start: "",
                },
                ...entry,
                ...{
                    id: `${entry.id}`,
                    description: redactString(entry.description ?? "", "_"),
                    duration: formatDuration(
                        entry.duration < 0
                            ? Math.round(Date.now() / 1000 + entry.duration)
                            : entry.duration,
                    ),
                    start: (entry.start ?? "").replace(/\+00:00$/, ""),
                    stop: (entry.stop ?? "").replace(/\+00:00$/, ""),
                },
            },
        })),
    ),
);

export const notionProjects = combineLatest([notion$, notionProjectsId.$]).pipe(
    switchMap(([notion, projectsId]) =>
        projectsId !== null && notion !== null
            ? notion.databases.query({
                  database_id: projectsId,
                  filter: {
                      property: "Active",
                      checkbox: { equals: true },
                  },
              }).$
            : of(undefined),
    ),
    rxCache(),
);

export const notionProjectNodes = notionProjects.pipe(
    map((projects) => projects?.results ?? []),
    map((projects) =>
        projects.map(
            (project): DataNode<NotionPage> => ({
                lenses: notionPageLenses,
                data: project,
            }),
        ),
    ),
);

const notionItemDisplays = notionProjects.pipe(
    map((response) =>
        response
            ? response.results
                  .map(notionItemDisplay)
                  .filter((item) => !item.redacted)
            : [],
    ),
);

export type ServicesMap = {
    [k: string]: Observable<ItemDisplay[]>;
};

export const user = {
    notion: {
        token: notionToken,
        dbId: notionProjectsId,
    },
    toggl: {
        token: togglToken,
    },
    personal: {
        projects: notionProjects,
    },
    services: {
        notion: notionItemDisplays,
        // toggl: togglDisplayItems$.pipe(
        //     map((items) =>
        //         items
        //             .filter((item) => !!item)
        //             .filter(
        //                 (item, i, a) =>
        //                     item &&
        //                     a.findIndex((j) => j.title === item.title) === i,
        //             ),
        //     ),
        // ),
        // projects: notionItemDisplays,
    } as ServicesMap,
};
