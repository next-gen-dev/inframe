import parseMessage from "gmail-api-parse-message";

export interface Email {
    from: string;
    date: number;
    subject: string;
    textPlain: string;
    textHtml: string | undefined;
}

function cleanQuote(html: string | undefined) {
    if (!html) {
        return html;
    }
    const index = html.indexOf('<div class="gmail_quote"');
    if (index === -1) {
        return html;
    }
    return html.substring(0, index);
}

// TODO: Consider return a `Result` monad, where if it fails to parse the email,
//       it returns some kind of error or message
export function parseEmail(
    message: gapi.client.gmail.Message,
): Email | undefined {
    const headers = message.payload?.headers ?? [];
    const date = message.internalDate
        ? parseInt(message.internalDate)
        : undefined;
    const from = headers.find(
        (header) => header.name?.toLowerCase() === "from",
    )?.value;
    const subject =
        headers.find((header) => header.name?.toLowerCase() === "subject")
            ?.value ?? "";
    const parsed = parseMessage(message);
    if (from && date && !isNaN(date)) {
        return {
            from,
            date,
            subject,
            textPlain: parsed.textPlain,
            textHtml: cleanQuote(parsed.textHtml),
        };
    }
    return undefined;
}

export function parseEmails(messages: gapi.client.gmail.Message[]): Email[] {
    return messages.reduce((a, msg) => {
        const email = parseEmail(msg);
        return email ? a.concat(email) : a;
    }, [] as Email[]);
}

export function responseTimes(myEmail: string, emails: Email[]): number[] {
    const myFrom = `<${myEmail}>`;
    let times: number[] = [];
    for (let i = 1; i < emails.length; i++) {
        if (
            emails[i].from.endsWith(myFrom) &&
            !emails[i - 1].from.endsWith(myFrom)
        ) {
            times.push(emails[i].date - emails[i - 1].date);
        }
    }
    return times;
}
