import { shareReplay } from "rxjs";

export function rxCache<T>() {
    return shareReplay<T>({ refCount: true, bufferSize: 1 });
}
