import { Observable } from "rxjs";

export interface Live<T> {
    $: Observable<T>;
}

export interface Writable<T> {
    $: Observable<T>;
    set(v: T): void | Promise<void>;
}

export function liveRx<T>(observable: Observable<T>): Live<T> {
    return {
        $: observable,
    };
}
