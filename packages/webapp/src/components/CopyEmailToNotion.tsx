import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { SearchResponse } from "@notionhq/client/build/src/api-endpoints";
import { useObservableState } from "observable-hooks";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    firstValueFrom,
    map,
    Observable,
    of,
    switchMap,
} from "rxjs";
import { ItemDisplay } from "../lib/item-display";
import { parseEmail } from "../lib/models/gmail/email";
import { gmailClient$ } from "../lib/models/gmail/gmail";
import { gmailCurrentUser$ } from "../lib/models/gmail/google-login";
import { notion$, notionItemDisplay } from "../lib/models/notion";
import { visuallyRedact } from "../utils/redactor";
import RenderIcon from "./RenderIcon";

import parseHtmlToNotionBlocks from "html-to-notion";

export function CopyEmailToNotion() {
    const params = useParams();
    const threadId = params["threadId"] ?? "";
    const searchInputValue = useMemo(() => new BehaviorSubject(""), []);

    const pageResults$ = useMemo(
        () =>
            combineLatest([
                searchInputValue.pipe(debounceTime(150)),
                notion$,
            ]).pipe(
                switchMap(
                    ([searchInput, notion]): Observable<
                        SearchResponse | undefined
                    > => {
                        if (notion && searchInput) {
                            return notion.search({
                                query: searchInput,
                            }).$;
                        } else {
                            return of(undefined);
                        }
                    },
                ),
                map((response): ItemDisplay[] => {
                    if (response) {
                        return response.results.map((item) =>
                            notionItemDisplay(item),
                        );
                    }
                    return [];
                }),
            ),
        [],
    );

    const items = useObservableState(pageResults$, []);

    const theme = useTheme();

    const handleCopyToNotion = async (notionPageId: string) => {
        console.log("handleCopyToNotion");
        try {
            // Get thread info
            await firstValueFrom(gmailCurrentUser$);
            const gmailClient = await firstValueFrom(gmailClient$);
            const thread = await gmailClient.users.threads.get({
                id: threadId,
                userId: "me",
            });
            const notion = await firstValueFrom(notion$);
            if (!notion) {
                return;
            }
            // Transform thread info into notion blocks
            // Store thread notion blocks at the end of the page

            (thread.result.messages ?? []).forEach((message) => {
                const email = parseEmail(message);
                console.log(email?.textHtml);
            });

            const callouts: any[] = (thread.result.messages ?? []).map(
                (message) => {
                    const email = parseEmail(message);
                    const blocks = parseHtmlToNotionBlocks(
                        (email?.textHtml ?? "").replaceAll(/\n+/g, "<br/>"),
                    );
                    return {
                        object: "block",
                        type: "callout",
                        callout: {
                            text: [
                                {
                                    type: "text",
                                    text: {
                                        content: `${email?.from ?? ""}`,
                                    },
                                },
                            ],
                            icon: {
                                type: "emoji",
                                emoji: "✉️",
                            },
                            children: [
                                {
                                    type: "divider",
                                    divider: {},
                                },
                                ...blocks,
                            ],
                        },
                    };
                },
            );

            const firstMessage = (thread.result.messages ?? [])[0];
            const subject = firstMessage
                ? parseEmail(firstMessage)?.subject ?? ""
                : "";

            const appendOperation = notion.blocks.children.append({
                block_id: notionPageId,
                children: [
                    {
                        heading_3: { text: [{ text: { content: subject } }] },
                    },
                    ...callouts,
                ],
            });

            await firstValueFrom(appendOperation.$);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Stack>
            <Typography variant="h4" sx={{ marginInline: 3, marginBlock: 2 }}>
                Embed Thread in Notion
            </Typography>
            <TextField
                label="Search Notion Pages"
                variant="outlined"
                autoComplete="off"
                onChange={(event) => {
                    searchInputValue.next(event.target?.value ?? "");
                }}
                sx={{ marginInline: 3, marginBlock: 1 }}
            />

            <List
                sx={{
                    padding: `0 0 ${theme.spacing(3)}`,
                    "& .MuiListItemButton-root": {
                        paddingLeft: 3,
                        paddingRight: 3,
                    },
                    "& .MuiListItemIcon-root, & .MuiListItemAvatar-root": {
                        minWidth: 0,
                        marginRight: 2,
                        display: "flex",
                    },
                }}
            >
                {(items ?? []).map((item) => (
                    <ListItem disablePadding key={item.id}>
                        <ListItemButton
                            onClick={() => handleCopyToNotion(item.id)}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: "transparent",
                                        color: theme.palette.text.disabled,
                                        width: 20,
                                        height: 20,
                                        fontSize: 18,
                                    }}
                                    variant="rounded"
                                >
                                    <RenderIcon icon={item.image} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    whiteSpace: "nowrap",
                                    "& .MuiTypography-root": {
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    },
                                }}
                            >
                                {visuallyRedact(
                                    item.title,
                                    theme.palette.text.disabled,
                                )}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
