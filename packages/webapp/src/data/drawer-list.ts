import notionLogo from "./images/notion.png";
import gmailLogo from "./images/gmail.png";
import togglLogo from "./images/toggl-track.png";
import pelotonLogo from "./images/peloton.png";
import { componentIcon, emojiIcon, imageIcon } from "../lib/icon-def";
import FolderIcon from "@mui/icons-material/Folder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";
import { ItemDisplay } from "../lib/item-display";
import { TableDefinition, TableSchema } from "../lib/table-types";
import {
    gmailInboxThreadsNodes,
    gmailSchema,
    gmailThreadsLib,
    gmailThreadsNodes,
} from "../lib/models/gmail/gmail";
import {
    notionProjectNodes,
    togglEntryNodes$,
    togglFlatUiEntries$,
    togglWorkspaces$,
} from "../lib/data";
import { map, Observable, of, shareReplay, startWith } from "rxjs";
import { DataNode, Lenses } from "../lib/architecture/data-node";
import { workspaceNode } from "../lib/models/toggl/toggl-workspaces";
import { pelotonWorkoutNodes$, pelotonWorkouts$ } from "../lib/models/peloton";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { ActionIcon } from "../components/utils/ActionIcons";
import React from "react";
import {
    apiSources$,
    drawerItem,
    DrawerItem,
    fileSources$,
    localSources$,
} from "../lib/models/sources";

const workspaceNodes = togglWorkspaces$.pipe(
    map((workspaces) => workspaces.map((w) => workspaceNode(w))),
);

export const constantDrawerNodes: DataNode<DrawerItem>[] = [
    drawerItem(
        {
            id: "notion",
            title: "Notion",
            image: imageIcon(notionLogo),
            // TODO: add the children property here
        },
        of([
            drawerItem(
                {
                    title: "Projects",
                    id: "projects",
                    image: componentIcon(FolderIcon),
                },
                notionProjectNodes,
            ),
        ]),
    ),
    drawerItem(
        {
            id: "toggl",
            title: "Toggl Track",
            image: imageIcon(togglLogo),
        },
        of([
            drawerItem(
                {
                    title: "Entries",
                    id: "entries",
                    image: componentIcon(AccessTimeIcon),
                },
                togglEntryNodes$,
            ),
            drawerItem(
                {
                    title: "Workspaces",
                    id: "workspaces",
                    image: componentIcon(FolderIcon),
                },
                workspaceNodes,
            ),
        ]),
    ),
    drawerItem(
        {
            title: "Gmail",
            id: "gmail",
            image: imageIcon(gmailLogo),
            // TODO: Replace for node children
            // items: {
            //     schema: gmailSchema,
            //     rows: gmailThreadsLib.$,
            // },
        },
        // gmailInboxThreadsNodes
        of([
            drawerItem(
                {
                    title: "Inbox",
                    id: "inbox",
                    image: componentIcon(InboxIcon),
                },
                gmailInboxThreadsNodes,
            ),
            drawerItem(
                {
                    title: "Sent",
                    id: "sent",
                    image: componentIcon(SendIcon),
                },
                gmailThreadsNodes,
            ),
        ]),
    ),
    drawerItem(
        {
            title: "Peloton",
            id: "peloton",
            image: imageIcon(pelotonLogo),
        },
        of([
            drawerItem(
                {
                    title: "Workouts",
                    id: "workouts",
                    image: componentIcon(FitnessCenterIcon),
                },
                pelotonWorkoutNodes$,
            ),
        ]),
    ),
];

export const drawerNodes$ = fileSources$; // of(constantDrawerNodes);
// sources$.$.pipe(
//     startWith([]),
//     map((sources) => [...constantDrawerNodes, ...sources]),
//     shareReplay({ refCount: true, bufferSize: 1 }),
// );

// DEPRECATED: please use drawerNodes instead
export const drawerList: DrawerItem[] = [
    {
        title: "Notion",
        id: "notion",
        image: imageIcon(notionLogo),
    },
    {
        title: "Toggl Track",
        id: "toggl",
        image: imageIcon(togglLogo),
        // items: {
        //     schema: [],
        //     rows: togglFlatUiEntries$,
        // },
        children: [
            {
                title: "Entries",
                id: "entries",
                image: componentIcon(AccessTimeIcon),
            },
            {
                title: "Workspaces",
                id: "workspaces",
                image: componentIcon(FolderIcon),
                nodes: togglWorkspaces$.pipe(
                    map((workspaces) =>
                        workspaces.map((w) => workspaceNode(w)),
                    ),
                ),
            },
        ],
    },
    {
        title: "Gmail",
        id: "gmail",
        image: imageIcon(gmailLogo),
        // children: [
        //     {
        //         name: "Inbox",
        //         path: "inbox",
        //         image: componentIcon(InboxIcon),
        //     },
        //     {
        //         name: "Sent",
        //         path: "sent",
        //         image: componentIcon(SendIcon),
        //     },
        // ],
        // items: {
        //     schema: gmailSchema,
        //     rows: gmailThreadsLib.$,
        // },
    },
];
