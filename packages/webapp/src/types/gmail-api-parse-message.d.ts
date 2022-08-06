declare module "gmail-api-parse-message" {
    function parseMessage(response: gapi.client.gmail.Message): ParsedMessage;

    type Headers = { [k: string]: string };

    export interface ParsedAttachment {
        filename: string;
        mimeType: string;
        size: number;
        attachmentId: string;
        headers: Headers;
    }

    export interface ParsedMessage {
        id: string;
        threadId: string;
        labelIds: string[];
        snipped: string;
        historyId: string;
        internalDate: number;
        attachments: ParsedAttachment[];
        inline: ParsedAttachment[];
        headers: Headers;
        textPlain: string;
        textHtml: string | undefined;
    }

    export default parseMessage;
}
