import { useCallback, useState } from "react";
import { ItemDisplay } from "../../lib/item-display";
import AddAppCard from "../AddAppCard";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import githubLogo from "../../data/images/github.png";
import msTodoLogo from "../../data/images/ms-todo.png";
import gCalendarLogo from "../../data/images/gcalendar.png";
import azureDevOpsLogo from "../../data/images/azuredevops.png";
import slackLogo from "../../data/images/slack.png";
import jiraLogo from "../../data/images/jira.png";
import { componentIcon, imageIcon } from "../../lib/icon-def";
import SearchIcon from "@mui/icons-material/Search";
import { constantDrawerNodes } from "../../data/drawer-list";
import { localStorageConnectionDef } from "../../lib/models/localstorage";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RenderIcon from "./../RenderIcon";
import {
    localSourceItems$,
    localSources$,
    NewConnectionDefinition,
    ResolvableInfo,
    ResolvableItem,
} from "../../lib/models/sources";
import { firstValueFrom } from "rxjs";
import { countriesConnectionDef } from "../../lib/models/countries";

// const services: ItemDisplay[] = constantDrawerNodes
//     .map((n) => n.lenses.listItem(n.data))
//     .concat([
//         {
//             id: "azuredevops",
//             title: "Azure DevOps",
//             image: imageIcon(azureDevOpsLogo),
//         },
//         {
//             id: "mstodo",
//             title: "Microsoft To-Do",
//             image: imageIcon(msTodoLogo),
//         },
//         {
//             id: "google-calendar",
//             title: "Google Calendar",
//             image: imageIcon(gCalendarLogo),
//         },
//         {
//             id: "github",
//             title: "GitHub",
//             image: imageIcon(githubLogo),
//         },
//         {
//             id: "slack",
//             title: "Slack",
//             image: imageIcon(slackLogo),
//         },
//         {
//             id: "jira",
//             title: "Jira",
//             image: imageIcon(jiraLogo),
//         },
//         {
//             id: "localstorage",
//             title: "LocalStorage",
//             image: componentIcon(TableChartIcon),
//         },
//         // Jira
//     ]);

const services: NewConnectionDefinition[] = [
    // localStorageConnectionDef,
    countriesConnectionDef,
];

function genId() {
    return (
        Math.random().toString(36).substring(2, 8) +
        Math.random().toString(36).substring(2, 8)
    );
}

export default function NewConnection() {
    const [searchString, setSearchString] = useState("");
    const filteredServices = services.filter((service) =>
        searchString.trim().length === 0
            ? true
            : service.display.title
                  .toLowerCase()
                  .includes(searchString.toLowerCase()),
    );

    const handleClick = useCallback(
        async (service: NewConnectionDefinition) => {
            const items = await firstValueFrom(localSourceItems$.$);
            localSourceItems$.set(
                (items ?? []).concat({
                    id: genId(),
                    resolvable: { type: service.resolvableType },
                    display: service.display,
                }),
            );
        },
        [],
    );
    return (
        <>
            <Box
                sx={{
                    // display: "grid",
                    // gridAutoColumns: "100px",
                    p: 2,
                }}
            >
                <Box sx={{ p: 1 }}>
                    <Typography variant="h6">New Connnection</Typography>
                    <br />
                    <TextField
                        placeholder="Search"
                        variant="outlined"
                        autoComplete="off"
                        sx={{ width: "100%", maxWidth: "516px" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={(event) =>
                            setSearchString(event.target.value ?? "")
                        }
                    />
                </Box>
                {filteredServices.map((service) => (
                    <AddAppCard
                        service={service}
                        key={service.display.id}
                        onClick={handleClick}
                    />
                ))}
            </Box>
        </>
    );
}
