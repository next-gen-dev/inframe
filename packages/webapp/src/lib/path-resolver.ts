import { map, Observable, of } from "rxjs";
import { notionProjects, togglEntries$, togglWorkspaces$ } from "./data";
import { gmailThreadsLib, gmailThreadsNodes } from "./models/gmail/gmail";
import { pelotonWorkouts$ } from "./models/peloton";

export function resolvePageObject(
    path: string[],
): Observable<{ [k: string]: any } | undefined> {
    if (path[0] === "notion") {
        if (path[1] === "projects" && path.length === 3) {
            return notionProjects.pipe(
                map((projects) => {
                    return projects?.results.find(
                        (project) => project.id === path[2],
                    );
                }),
            );
        }
    }
    if (path[0] === "toggl") {
        if (path[1] === "entries" && path.length === 3) {
            return togglEntries$.pipe(
                map((entries) => {
                    return entries.find((entry) => `${entry.id}` === path[2]);
                }),
            );
        } else if (path[1] === "workspaces" && path.length === 3) {
            return togglWorkspaces$.pipe(
                map((item) => {
                    return item.find((item) => `${item.id}` === path[2]);
                }),
            );
        }
    }
    if (path[0] === "gmail") {
        if (path[1] === "sent" && path.length === 3) {
            return gmailThreadsLib.$.pipe(
                map((entries) => {
                    return entries.find((entry) => `${entry.id}` === path[2]);
                }),
            );
        }
        // else if (path[1] === "workspaces" && path.length === 3) {
        //     return togglWorkspaces$.pipe(
        //         map((item) => {
        //             return item.find((item) => `${item.id}` === path[2]);
        //         }),
        //     );
        // }
    }
    if (path[0] === "peloton") {
        if (path[1] === "workouts" && path.length === 3) {
            return pelotonWorkouts$.pipe(
                map((workouts) => {
                    return workouts.find(
                        (workouts) => `${workouts.id}` === path[2],
                    );
                }),
            );
        }
    }
    return of(undefined);
}
