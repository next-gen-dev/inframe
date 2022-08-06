import { ItemDisplay } from "../lib/item-display";
import reactStringReplace from "react-string-replace";
import { ReactNodeArray } from "react";
// import redactedWords from "./redacted-words.json";
const redactedWords: string[] = [];

export const REDACT_CONTENT = false;

export const redactedIds: string[] = [];

export function visuallyRedact(input: string, color: string) {
    if (!REDACT_CONTENT) {
        return input;
    }
    const redactor = (match: string) => {
        return (
            <span style={{ color: "transparent", backgroundColor: color }}>
                {match}
            </span>
        );
    };
    return redactedWords.reduce(
        (
            result: string | ReactNodeArray,
            redactedName,
        ): string | ReactNodeArray =>
            reactStringReplace(result, redactedName, redactor),
        input,
    );
}

export function redactPropertyValue(value: any, redactingChar: string = "█") {
    switch (typeof value) {
        case "string":
            return value.replaceAll(/./g, redactingChar);
        case "number":
            return redactNumber(value);
    }
}

export function redactString(
    text: string,
    redactingChar: string = "█",
): string {
    if (!REDACT_CONTENT) {
        return text;
    }
    let newText = text;
    for (let name of redactedWords) {
        const redacted = name.replace(/./g, redactingChar);
        newText = newText.replaceAll(name, redacted);
    }
    return newText;
}

export function redactNumber(num: number, digit: number = 9): number {
    if (!REDACT_CONTENT) {
        return num;
    }
    const nines = Math.pow(10, Math.ceil(Math.log10(num + 1))) - 1;
    if (digit < 9 && digit > 0) {
        return (nines / 9) * digit;
    }
    return nines;
}

export function redactItem(item: ItemDisplay, redactingChar: string = "█") {
    if (!REDACT_CONTENT) {
        return item;
    }
    if (redactedIds.includes(item.id)) {
        item.title = item.title.replace(/./g, redactingChar);
        item.redacted = true;
    } else {
        let newTitle = redactString(item.title, redactingChar);
        if (newTitle !== item.title) {
            item.redacted = true;
            item.title = newTitle;
        }
    }
    return item;
}
