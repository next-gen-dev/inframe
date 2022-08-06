import {
    defer,
    firstValueFrom,
    from,
    map,
    Observable,
    of,
    shareReplay,
    switchMap,
} from "rxjs";
import { ActionIcon } from "../../components/utils/ActionIcons";
import { DataNode, Lenses } from "../architecture/data-node";
import { liveJsonLocalStorage } from "../browser";
import { componentIcon, emojiIcon, IconDef } from "../icon-def";
import { ItemDisplay } from "../item-display";
import { Writable } from "../live";
import { liveRefreshable, Refreshable } from "../refreshable";
import { TableDefinition } from "../table-types";
import { localStorageConnectionDef, localStorageNodes$ } from "./localstorage";
import DeleteIcon from "@mui/icons-material/Delete";
import { countriesConnectionDef, countriesNodes$ } from "./countries";
import { FileItem } from "@inframe/common";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Code } from "@mui/icons-material";

// import TableChartIcon from '@mui/icons-material/TableChart';

// Deprecated
export interface DrawerItem extends ItemDisplay {
    children?: DrawerItem[];
    items?: TableDefinition;
    nodes?: Observable<DataNode[]>;
}

export interface ResolvableInfo {
    type: string;
    params?: string[];
}

export interface ResolvableItem extends DrawerItem {
    resolve?: {
        type: string;
        params?: string[];
    };
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

export const drawerItemLenses: Lenses<DrawerItem> = {
    id: (item) => item.id, // probably not true, since this isn't the full id
    listItem: (item) => item,
};

export function drawerItem(
    item: DrawerItem,
    children?: Observable<DataNode[]>,
    actionIcons?: ActionIcon[],
): DataNode<DrawerItem> {
    return {
        lenses: drawerItemLenses,
        data: item,
        children,
        actionIcons,
    };
}

async function fetchApi<T>(
    urlPath: string,
    requestInit: RequestInit = { method: "GET" },
) {
    const res = await fetch(`http://localhost:8081/${urlPath}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...requestInit,
    });
    return res.json();
}

const fileLenses: Lenses<FileItem> = {
    id: (item) => item.name,
    listItem: (item) => ({
        id: item.name,
        title: item.name,
        image:
            typeof item === "object"
                ? "isDir" in item
                    ? componentIcon(
                          item.isDir ? FolderIcon : InsertDriveFileIcon,
                      )
                    : emojiIcon((item as any).emoji)
                : undefined,
    }),
};

function fileValue(data: FileItem): Observable<any> {
    return defer(() => fetchApi(`data/files/${data.path}`)).pipe(
        shareReplay({ refCount: false, bufferSize: 1 }),
    );
}

function fileChildren(data: FileItem): Observable<DataNode<any>[]> | undefined {
    return apiNodes("files", `files/${data.path}`);
}

function withLenses(type: string, data: any): DataNode<any> | undefined {
    switch (type) {
        case "files":
            return {
                data,
                lenses: fileLenses,
                value: fileValue(data),
                actionIcons:
                    typeof data.path !== "string"
                        ? []
                        : [
                              //   {
                              //       icon: componentIcon(Code),
                              //       key: "export-code",
                              //       onClick: (context) => {
                              //           context.exportCode(
                              //               `files/${data.path}`
                              //                   .split("/")
                              //                   .filter(
                              //                       (v: string) => !!v?.trim(),
                              //                   ),
                              //           );
                              //       },
                              //   },
                          ],
            };
    }
    return undefined;
}

function addActionIcons<T>(
    drawerItem: DataNode<DrawerItem>,
    icons: ActionIcon[],
): DataNode<DrawerItem> {
    return {
        ...drawerItem,
        actionIcons: (drawerItem.actionIcons ?? []).concat(icons),
    };
}

function apiNodes<T = any>(
    id: string,
    path: string = id,
): Observable<DataNode<T>[]> {
    return defer(() => fetchApi(`data/${path}`)).pipe(
        map((items: any[]): DataNode<any>[] =>
            items
                .map((item) => withLenses(id, item))
                .filter(
                    (item: DataNode<any> | undefined): item is DataNode<any> =>
                        item !== undefined,
                ),
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
    );
}

function resolveResolvable(
    item: ResolvableInfo,
    id: string,
    display: ItemDisplay,
): DataNode<DrawerItem> | undefined {
    switch (item.type) {
        case "files":
            return drawerItem(
                {
                    ...display,
                    id,
                },
                apiNodes(id),
            );
        case "countries":
            return drawerItem(
                {
                    ...display,
                    id,
                },
                countriesNodes$,
            );
        case "localstorage":
            return drawerItem(
                {
                    ...display,
                    id,
                },
                localStorageNodes$,
            );
    }
    return undefined;
}

export const localSourceItems$: Writable<StoredConnection[] | undefined> &
    Refreshable<StoredConnection[] | undefined> =
    liveJsonLocalStorage["inframe.collections"];

function addRemoveActionIcons(
    drawerItem: DataNode<DrawerItem> | undefined,
    id: string,
): DataNode<DrawerItem> | undefined {
    if (!drawerItem) {
        return undefined;
    }
    return addActionIcons(drawerItem, [
        {
            key: "Remove",
            icon: componentIcon(DeleteIcon),
            onClick: async () => {
                const items = await firstValueFrom(localSourceItems$.$);
                await localSourceItems$.set(
                    (items ?? []).filter((item) => item.id !== id),
                );
                // TODO: navigate away?
            },
        },
    ]);
}

const apiSourcesItems$ = liveRefreshable(async () => {
    try {
        const res = await fetch(`http://localhost:8081/inframe`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const rawSources: StoredConnection[] = await res.json();

        return rawSources;
    } catch (e) {
        return [];
    }
});

function enrichSourceItems(
    sourceItems: Observable<StoredConnection[] | undefined>,
) {
    return sourceItems.pipe(
        map((v) =>
            Array.isArray(v)
                ? v
                      .map((item) =>
                          addRemoveActionIcons(
                              resolveResolvable(
                                  item.resolvable,
                                  item.id,
                                  item.display,
                              ),
                              item.id,
                          ),
                      )
                      .filter((v): v is DataNode<DrawerItem> => v !== undefined)
                : [],
        ),
    );
}

export const apiSources$ = enrichSourceItems(apiSourcesItems$.$);
export const localSources$ = enrichSourceItems(localSourceItems$.$);

export const fileSources$ = apiNodes("files");

// export const sources$ = liveRefreshable(
//     async (): Promise<DataNode<DrawerItem>[]> => {
//         try {
//             const res = await fetch(`${apiRoot}/sources`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });
//             const rawSources: ResolvableItem[] = await res.json();

//             return rawSources.map((item) => enrichSource(item)).filter((v): v is DataNode<DrawerItem> => v !== undefined);
//         } catch (e) {
//             return [];
//         }
//     },
// );
