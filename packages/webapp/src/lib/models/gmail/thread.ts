import { interval, map, Observable, startWith } from "rxjs";
import { DataNode } from "../../architecture/data-node";
import { Email, parseEmail, parseEmails } from "./email";

export interface EmailThread {
    id: string;
    subject: string;
    snippet: string;
    emails: Email[];
    // shouldRespond: Observable<boolean>;
}

export function cleanThreadSubject(subject: string): string {
    return subject.replace(/^(Fwd|Re):\s+/, "");
}

export function parseThread(thread: gapi.client.gmail.Thread): EmailThread {
    const emails = parseEmails(thread.messages ?? []);
    return {
        id: thread.id ?? "",
        subject: cleanThreadSubject(
            emails.length > 0 ? emails[0].subject ?? "" : "",
        ),
        emails,
        snippet: thread.snippet ?? "",
        // shouldRespond: interval(1000).pipe(
        //     startWith(0),
        //     map((n) => n % 2 === 0),
        // ),
    };
}
