export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.substring(1);
}

// Can be optimized to not search the string multiple times
function separateWords(text: string): string[] {
    if (text.indexOf("_") !== -1) {
        return text.split("_").filter((word) => word.length > 0);
    }
    return [text];
}

export function spaceCase(text: string): string {
    const words = separateWords(text);
    return words.join(" ");
}

// TODO: titleCase should ignore some words like "a"
export function titleCase(text: string): string {
    const words = separateWords(text);
    return words.map((word) => capitalize(word)).join(" ");
}
