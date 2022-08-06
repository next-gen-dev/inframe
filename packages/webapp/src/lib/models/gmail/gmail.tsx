import { firstValueFrom, map, Observable, shareReplay, switchMap } from "rxjs";
import { liveRefreshable } from "../../refreshable";
import { SchemaFields, TableRow } from "../../table-types";
import { Email, parseEmails, responseTimes } from "./email";
import { gmailCurrentUser$ } from "./google-login";
import { decode } from "he";
import { redactString } from "../../../utils/redactor";
import { DataNode, Lenses } from "../../architecture/data-node";
import { componentIcon } from "../../icon-def";
import ForumIcon from "@mui/icons-material/Forum";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import notionLogo from "../../../data/images/notion.png";
import { EmailThread, parseThread } from "./thread";

export const gmailSchema = [
    { name: "Thread", id: "snippet" },
    { name: "Response Time", id: "averageDelay" },
    { name: "Last Message Time", id: "lastMessageTime", sort: true },
    { name: "Messages", id: "numberOfMessages" },
] as const;
export type GmailSchemaFields = SchemaFields<typeof gmailSchema>;

export interface EnhancedGmailThread extends gapi.client.gmail.Thread {
    emails?: Email[];
    delays?: number[];
    averageDelay?: number;
    lastMessageTime?: number;
    numberOfMessages?: number;
}

export const gapiClient$ = new Observable<typeof gapi.client>((subscriber) => {
    gapi.load("client", {
        callback: () => {
            subscriber.next(gapi.client);
        },
        onerror: (error: any) => {
            subscriber.error(error);
        },
    });
}).pipe(shareReplay({ refCount: false, bufferSize: 1 }));

export const gmailClient$ = gapiClient$.pipe(
    switchMap(
        (client) =>
            new Observable<typeof gapi.client.gmail>((subscriber) => {
                client.load("gmail", "v1", () => {
                    subscriber.next(gapi.client.gmail);
                });
            }),
    ),
    shareReplay({ refCount: false, bufferSize: 1 }),
);

export async function gmailBatchedMessages(messageIds: string[]) {
    const batch: gapi.client.Batch<gapi.client.gmail.Thread> =
        gapi.client.newBatch();
    for (let msgId of messageIds) {
        batch.add(
            gapi.client.gmail.users.threads.get({ id: msgId, userId: "me" }),
            { id: msgId, callback() {} },
        );
    }
    const response = await batch;
    return response;
}

function averageDelay(delays: number[]): number | undefined {
    return delays.length > 0
        ? delays.reduce((a, b) => a + b) / delays.length
        : undefined;
}

function formatDuration(delay: number): string {
    const days = Math.floor(delay / 1000 / 60 / 60 / 24);
    return `${days}d - ${new Date(delay).toISOString().substring(11, 16)}`;
}

export const gmailThreadLenses: Lenses<EnhancedGmailThread> = {
    id: (thread) => `gmail/threads/${thread.id ?? ""}`,
    listItem: (thread) => ({
        id: thread.id ?? "",
        title: thread.snippet ?? "",
        image: componentIcon(ForumIcon),
    }),
};

export const emailThreadLenses: Lenses<EmailThread> = {
    id: (thread) => `gmail/threads/${thread.id ?? ""}`,
    listItem: (thread) => ({
        id: thread.id ?? "",
        title: thread.subject ?? "",
        image: componentIcon(ForumIcon),
    }),
};

export const gmailLabelThreads = (labelIds: string[]) =>
    liveRefreshable(async () => {
        // Ensures the token is loaded
        try {
            const user = await firstValueFrom(gmailCurrentUser$);
            const userEmail = user.getBasicProfile().getEmail();

            const gmailClient = await firstValueFrom(gmailClient$);
            const resp = await gmailClient.users.threads.list({
                labelIds,
                userId: "me",
                maxResults: 20,
            });
            const threadsResponse = resp.result;

            const sentThreads = threadsResponse.threads ?? [];
            const responseMessages = await gmailBatchedMessages(
                sentThreads.reduce(
                    (a, t) => (t.id ? a.concat(t.id) : a),
                    [] as string[],
                ),
            );
            const threads = sentThreads
                .map((t) => {
                    const id = t.id;
                    if (!id) return undefined;
                    const thread = responseMessages.result[id]?.result;
                    if (!thread) return undefined;
                    const emails = thread.messages
                        ? parseEmails(thread.messages)
                        : [];
                    const lastMessageTime =
                        emails.length > 0
                            ? emails
                                  .map((e) => e.date)
                                  .reduce((a, b) => (a > b ? a : b))
                            : undefined;
                    const responseDelays = responseTimes(userEmail, emails);
                    const avg = averageDelay(responseDelays);
                    return {
                        ...t,
                        ...thread,
                        snippet: decode(t.snippet ?? thread.snippet ?? ""),
                        emails,
                        delays: responseDelays,
                        lastMessageTime: lastMessageTime,
                        averageDelay: avg,
                        numberOfMessages: thread.messages?.length ?? 0,
                    } as EnhancedGmailThread;
                })
                .filter((t): t is EnhancedGmailThread => !!t)
                .sort(
                    (a, b) =>
                        (b.lastMessageTime ?? 0) - (a.lastMessageTime ?? 0),
                )
                .map((t) => parseThread(t));
            return threads;
        } catch (e) {
            console.error("Failed to get threads", e);
            return [];
        }
    });

export const gmailThreadsLib = gmailLabelThreads(["SENT"]);

function mapGmailThreads(threads: EmailThread[]): DataNode<EmailThread>[] {
    return threads.map(
        (thread): DataNode<EmailThread> => ({
            lenses: emailThreadLenses,
            data: thread,
            actionIcons: [
                // {
                //     key: "copy",
                //     // icon: <ContentCopyIcon />,
                //     icon: (
                //         <img
                //             src={notionLogo}
                //             style={{
                //                 maxWidth: "22px",
                //                 maxHeight: "22px",
                //             }}
                //         />
                //     ),
                //     href: `gmail/sent/${thread.id ?? ""}/copy`,
                // },
            ],
        }),
    );
}

export const gmailThreadsNodes = gmailThreadsLib.$.pipe(map(mapGmailThreads));
export const gmailInboxThreadsNodes = gmailLabelThreads(["INBOX"]).$.pipe(
    map(mapGmailThreads),
);

// Flat UI: (lens?)
// return (
//     threads
//         .map(
//             (thread): TableRow<GmailSchemaFields> => ({
//                 id: thread.id ?? "",
//                 data: {
//                     snippet: thread.snippet
//                         ? redactString(decode(thread.snippet), "_")
//                         : "",
//                     averageDelay: thread.averageDelay
//                         ? formatDuration(thread.averageDelay ?? 0)
//                         : "",
//                     lastMessageTime: thread.lastMessageTime
//                         ? new Date(thread.lastMessageTime).toISOString()
//                         : "",
//                     numberOfMessages: thread.numberOfMessages,
//                 },
//             }),
//         )
//         // TODO: remove in the future
//         .filter((row) => row.data.snippet || row.data.averageDelay)
// );
