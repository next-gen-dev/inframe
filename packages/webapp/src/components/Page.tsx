import { useObservableState } from "observable-hooks";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { map, Observable, of, startWith, switchMap } from "rxjs";
import { drawerList, drawerNodes$ } from "../data/drawer-list";
import { DataNode } from "../lib/architecture/data-node";
import { user } from "../lib/data";
import { ItemDisplay } from "../lib/item-display";
import { DrawerItem } from "../lib/models/sources";
import { resolvePageObject } from "../lib/path-resolver";
import PageBlocks from "./page-views/PageBlocks";
import PageList, { AsyncPageList } from "./page-views/PageList";
import PageObject from "./page-views/PageObject";
import { PageTable } from "./page-views/PageTable";
import Home from "./pages/Home";
import { ActionIcon, useActionIcons } from "./utils/ActionIcons";
import CodeIcon from "@mui/icons-material/Code";
// import ExportCodeDialog from "./ExportCodeDialog";
import { componentIcon } from "../lib/icon-def";
import PageMagicTable from "./page-views/PageMagicTable";
import { useCodeExport } from "./utils/CodeExportProvider";
import { PageAsyncValue } from "./page-views/PageRawValue";

interface PageProps {}

function searchDrawerNode(
    path: string[],
    list?: DataNode[],
    item?: DataNode,
): Observable<DataNode | undefined> {
    if (path.length === 0) {
        return of(item);
    }
    if (!list || list.length === 0) {
        return of(undefined);
    }
    const [id, ...newPath] = path;
    const newItem = list.find(
        (node) => node.lenses.listItem(node.data).id === id,
    );
    if (!newItem) {
        return of(undefined);
    }
    const children$: Observable<DataNode[] | undefined> =
        newItem.children ?? of(undefined);
    return children$.pipe(
        switchMap((newChildren: undefined | DataNode[]) =>
            searchDrawerNode(newPath, newChildren, newItem),
        ),
    );
}

export function Page({}: PageProps) {
    const params = useParams();
    const star = params["*"] ?? "";
    const objectPath = useMemo(
        () => star.split("/").filter((item) => item && item.length > 0),
        [star],
    );

    const drawerNode$ = useMemo(
        () =>
            drawerNodes$.pipe(
                switchMap((drawerNodes) =>
                    searchDrawerNode(objectPath, drawerNodes),
                ),
            ),
        [objectPath],
    );
    const drawerNode = useObservableState(drawerNode$, undefined);

    const { setActionIcons } = useActionIcons();

    const service = objectPath.length === 1 ? objectPath[0] : undefined;

    const { item: drawerItem } = objectPath.reduce<{
        item: undefined | DrawerItem;
        list: undefined | DrawerItem[];
    }>(
        ({ item, list }, key) => {
            const newItem = list?.find((v) => v.id === key);
            return { item: newItem, list: newItem?.children };
        },
        { item: undefined, list: drawerList },
    ); // drawerList.find((item) => item.id === service);
    const items$ = useMemo(
        () =>
            service === undefined || !user.services[service]
                ? of([])
                : user.services[service].pipe(startWith([])),
        [service],
    );
    const items = useObservableState(items$, new Array<ItemDisplay>());

    const [exportingCode, setExportingCode] = useState(false);

    useEffect(() => {
        let newActionIcons = drawerNode?.actionIcons ?? [];
        // if (drawerNode && objectPath.length >= 2) {
        //     console.log(objectPath.join("."));
        //     let codeActionIcon: ActionIcon = {
        //         icon: componentIcon(CodeIcon),
        //         key: "code",
        //         onClick: () => {
        //             setExportingCode(true);
        //         },
        //     };
        //     newActionIcons.push(codeActionIcon);
        // }
        setActionIcons(newActionIcons);
        return () => {
            setActionIcons([]);
        };
    }, [drawerNode]);

    const { Dialog } = useCodeExport();

    if (drawerNode?.value) {
        return (
            <>
                {Dialog}
                <PageAsyncValue value={drawerNode.value} />
            </>
        );
    }

    if (drawerNode) {
        return (
            <>
                {Dialog}
                <PageMagicTable drawerNode={drawerNode} />
            </>
        );
    }

    // // Can we get a dataNode here?
    // if (drawerNode) {
    //     return (
    //         <>
    //             <ExportCodeDialog
    //                 objPath={objectPath}
    //                 open={exportingCode}
    //                 onClose={() => setExportingCode(false)}
    //             />
    //             <PageBlocks dataNode={drawerNode} />
    //         </>
    //     );

    //     // if (drawerNode.children) {
    //     //     console.log("Using drawerNode for", objectPath);
    //     //     return (
    //     //         <AsyncPageList
    //     //             items={drawerNode.children.pipe(
    //     //                 map(
    //     //                     (nodes) =>
    //     //                         nodes
    //     //                             .map((node) =>
    //     //                                 node.lenses.listItem
    //     //                                     ? node.lenses.listItem(node.data)
    //     //                                     : undefined,
    //     //                             )
    //     //                             .filter((v) => !!v) as ItemDisplay[],
    //     //                 ),
    //     //             )}
    //     //         />
    //     //     );
    //     // }
    // }

    if (objectPath.length === 0) {
        return <Home />;
    }

    if (drawerItem && drawerItem.items) {
        console.log("Using drawerItem.items for", objectPath);
        return (
            <PageTable
                schema={drawerItem.items.schema}
                rows={drawerItem.items.rows}
            />
        );
    }

    if (objectPath.length > 1) {
        console.log("Using resolved object for", objectPath);
        // Resolve the object
        const obj = resolvePageObject(objectPath);
        // return object page
        return <PageObject object={obj} />;
    }

    console.log("Using pageList for", objectPath);
    return <PageList items={items} />;
}
