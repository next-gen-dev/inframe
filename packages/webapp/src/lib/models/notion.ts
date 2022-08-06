import { Client } from "@notionhq/client";
import {
    SearchResponse,
    GetPageResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { map, shareReplay } from "rxjs";
import { redactItem } from "../../utils/redactor";
import { apiRoot } from "../api";
import { Lenses } from "../architecture/data-node";
import { liveStringLocalStorage } from "../browser";
import { IconDef } from "../icon-def";
import { ItemDisplay } from "../item-display";
import { liveRefreshable, Refreshable } from "../refreshable";

export type NotionPage = GetPageResponse | SearchResponse["results"][0];

export const notionToken = liveStringLocalStorage["user.notion.apiKey"];

export const notion$ = notionToken.$.pipe(
    map((token) => (token ? notionObject(token) : null)),
    shareReplay({ refCount: true, bufferSize: 1 }),
);

export function notionTitle(item: NotionPage): string {
    if (item.object === "database") {
        return ""; //item.title.map((span) => span.plain_text).join("");
    }
    // for (let key in item.properties) {
    //     const prop = item.properties[key];
    //     if (prop.type === "title") {
    //         return prop.title.map((span) => span.plain_text).join("");
    //     }
    // }
    return "-- Unnamed --";
}

export type NotionIconDef =
    | {
          type: "emoji";
          emoji: string;
      }
    | {
          type: "external";
          external: {
              url: string;
          };
      }
    | {
          type: "file";
          file: {
              url: string;
              expiry_time: string;
          };
      }
    | null;

export function notionIconDef(notionIcon: NotionIconDef): IconDef | undefined {
    switch (notionIcon?.type) {
        case "emoji":
            return {
                type: "emoji",
                value: notionIcon.emoji,
            };
        case "file":
            return {
                type: "image",
                src: notionIcon.file.url,
            };
    }
    return undefined;
}

// TODO: the account sounds important in this scenario
export const notionPageLenses: Lenses<NotionPage> = {
    id: (page) => `notion/${page.id}`,
    listItem: (page) => ({
        id: `${page.id}`,
        title: notionTitle(page),
        // image: notionIconDef(page.icon),
    }),
};

export function notionItemDisplay(
    item: SearchResponse["results"][0],
): ItemDisplay {
    return redactItem({
        title: notionTitle(item),
        id: item.id,
        // image: notionIconDef(item.icon),
    });
}

// Find the root page: {parent: {type: "workspace", workspace: true}}
// Search is very limited, it's only possible to filter between page or database, and specify a string to search
// But if we have other sources, like a database, we can delegate the indexing and querying to a different source

// TODO: Types for the notion object and the return types
export function notionCall<T = any>(
    path: string,
    apiKey: string,
    params: object,
) {
    return liveRefreshable<T | undefined>(async (): Promise<T | undefined> => {
        try {
            const res = await fetch(`${apiRoot}/notion/${path}`, {
                method: "POST",
                // mode: "no-cors", // This limits the headers sent
                // credentials: "include", // CORS origin header must not be "*"
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });
            const json = await res.json();
            return json as T;
        } catch (e) {
            return undefined;
        }
    });
}

type FakeClient<T = Client> = {
    [K in keyof T]: T[K] extends (...args: infer ARGS) => Promise<infer U>
        ? (...args: ARGS) => Refreshable<U | undefined>
        : FakeClient<T[K]>;
};

function proxyCache(
    execute: (keypath: (string | symbol)[], args: any[]) => any,
    keypath: (string | symbol)[] = [],
): any {
    // If there's no keypath it's just an object,
    // because if it's a function, it misbehaves with some React utils
    return new Proxy<any>(keypath.length === 0 ? {} : () => {}, {
        get: (target: any, p: string | symbol, receiver: any): any => {
            if (p in target) {
                return target[p];
            }
            const next = proxyCache(execute, keypath.concat(p));
            target[p] = next;
            return next;
        },
        apply: (target: object, thisArg: any, argArray: any[]): any => {
            return execute(keypath, argArray);
        },
    });
}

export function notionObject(apiKey: string): FakeClient {
    return proxyCache((keypath, args) => {
        return notionCall(keypath.join("/"), apiKey, args);
    });
}

// export function notionTest() {
//     return Client.prototype.search;
// }
