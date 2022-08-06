import { combineLatest, map, Observable, switchMap } from "rxjs";
import { DataNode, Lenses } from "../architecture/data-node";
import { liveStringLocalStorage, localStorageKeys$ } from "../browser";
import { NewConnectionDefinition } from "./sources";
import TableChartIcon from "@mui/icons-material/TableChart";
import { componentIcon } from "../icon-def";

export type LocalStorageKVP = {
    key: string;
    value: any;
};

export const localStorageLenses: Lenses<LocalStorageKVP> = {
    id: (kvp) => kvp.key,
    listItem: (kvp) => ({
        id: kvp.key,
        title: kvp.key,
    }),
};

export const localStorageConnectionDef: NewConnectionDefinition = {
    display: {
        id: "localstorage",
        title: "LocalStorage",
        image: componentIcon(TableChartIcon),
    },
    resolvableType: "localstorage",
};

export const localStorageNodes$: Observable<DataNode<LocalStorageKVP>[]> =
    localStorageKeys$.$.pipe(
        switchMap((keys) =>
            combineLatest(
                keys.map((key) =>
                    liveStringLocalStorage[key].$.pipe(
                        map((value) => ({
                            data: {
                                key,
                                value,
                            },
                            lenses: localStorageLenses,
                        })),
                    ),
                ),
            ),
        ),
    );

// export const pelotonWorkoutNodes$: Observable<DataNode[]> =
//     pelotonWorkouts$.pipe(
//         map((workouts) =>
//             workouts.map(
//                 (workout): DataNode => ({
//                     data: workout,
//                     lenses: pelotonWorkoutLenses,
//                 }),
//             ),
//         ),
//     );
