import { merge, of, Subject, switchMap } from "rxjs";
import { rxCache } from "../utils/rx-cache";
import { Live } from "./live";

export interface Refreshable<T> extends Live<T> {
    refresh(): void;
}

export function liveRefreshable<T = any>(
    refresh: () => T | Promise<T>,
): Refreshable<T> {
    const refreshSubject = new Subject<void>();
    return {
        $: merge(of(undefined), refreshSubject).pipe(
            switchMap(async () => refresh()),
            rxCache(),
        ),
        refresh: () => {
            refreshSubject.next();
        },
    };
}
