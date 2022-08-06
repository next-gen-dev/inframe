import { apiRoot } from "../../api";
import { DataNode, Lenses } from "../../architecture/data-node";
import { componentIcon } from "../../icon-def";
import { liveRefreshable } from "../../refreshable";
import { TogglWorkspace } from "./toggl-types";
import WorkIcon from "@mui/icons-material/Work";

export function togglWorkspaces(apiKey: string) {
    return liveRefreshable(async (): Promise<TogglWorkspace[]> => {
        try {
            const res = await fetch(`${apiRoot}/toggl/workspaces`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            });
            const json: TogglWorkspace[] = await res.json();
            return json;
        } catch (e) {
            return [];
        }
    });
}

export const togglWorkspaceLenses: Lenses<TogglWorkspace> = {
    id: (w) => `toggl/workspaces/${w.id}`,
    listItem: (w) => ({
        id: `${w.id}`,
        title: w.name,
        // image
        image: componentIcon(WorkIcon),
    }),
};

export function workspaceNode(
    workspace: TogglWorkspace,
): DataNode<TogglWorkspace> {
    return {
        lenses: togglWorkspaceLenses,
        data: workspace,
    };
}
