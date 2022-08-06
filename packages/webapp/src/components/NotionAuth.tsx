import { useRef } from "react";
import { user } from "../lib/data";

export function NotionAuth() {
    const apiKeyInputRef = useRef<HTMLInputElement | null>(null);
    const dbIdInputRef = useRef<HTMLInputElement | null>(null);
    return (
        <form
            onSubmit={(event) => {
                if (apiKeyInputRef.current && dbIdInputRef.current) {
                    const apiKey = apiKeyInputRef.current.value;
                    const dbId = dbIdInputRef.current.value;
                    if (typeof apiKey === "string" && apiKey.length > 0) {
                        user.notion.token.set(apiKey);
                    }
                    if (typeof dbId === "string" && dbId.length > 0) {
                        user.notion.dbId.set(dbId);
                    }
                    apiKeyInputRef.current.value = "";
                }

                event.preventDefault();
            }}
        >
            <input
                placeholder="Notion API key"
                name="apiKey"
                ref={apiKeyInputRef}
            />
            <input
                placeholder="Notion Projects Database ID"
                name="dbId"
                ref={dbIdInputRef}
            />
            <button type="submit">Save</button>
        </form>
    );
}
