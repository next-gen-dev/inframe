import { map, shareReplay } from "rxjs";
import { rxCache } from "../utils/rx-cache";
import { cachedObject } from "./cache";
import { Writable } from "./live";
import { liveRefreshable, Refreshable } from "./refreshable";

export const localStorageKeys$ = liveRefreshable(() =>
    Object.keys(localStorage),
);

export const liveStringLocalStorage = cachedObject(
    (key: string): Writable<string | null> & Refreshable<string | null> => {
        const live = liveRefreshable(() => localStorage.getItem(key));
        return {
            ...live,
            set: (value: string | null) => {
                let needKeyRefresh = false;
                if (value === null) {
                    if (key in localStorage) {
                        needKeyRefresh = true;
                    }
                    localStorage.removeItem(key);
                } else {
                    if (!(key in localStorage)) {
                        needKeyRefresh = true;
                    }
                    localStorage.setItem(key, value);
                }
                live.refresh();
                if (needKeyRefresh) {
                    localStorageKeys$.refresh();
                }
            },
        };
    },
);

export const liveJsonLocalStorage = cachedObject(
    (key: string): Writable<any> & Refreshable<any> => {
        const live = liveStringLocalStorage[key];
        return {
            $: live.$.pipe(
                map((str) => (str ? JSON.parse(str) : undefined)),
                rxCache(),
            ),
            set: (value: any) => {
                live.set(value === undefined ? null : JSON.stringify(value));
            },
            refresh: () => {
                live.refresh();
            },
        };
    },
);
