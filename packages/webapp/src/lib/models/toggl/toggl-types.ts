// Docs: http://7eggs.github.io/node-toggl-api/TogglClient.html

export interface APIError extends Error {
    code: number;
    data: any;
    errors: string[];
}
export type ReportError = any;
export type ValidateError = any;
export type TogglId = number | string;

export interface TimeEntry {
    start: string;
    stop: string;
    duration: number;
    id: number;
    guid: string;
    wid: number;
    pid: number;
    billable: boolean;
    description?: string;
    created_with: string;
    tags: string[];
    at: string;
    uid: number;
}

export interface EnhancedTimeEntry extends TimeEntry {
    color?: string; // hex
}

export interface TogglWorkspace {
    id: number;
    name: string;
    premium: boolean;
    admin: boolean;
    default_hourly_rate?: number;
    default_currency: string;
    only_admins_may_create_projects: boolean;
    only_admins_see_billable_rates: boolean;
    rounding: number;
    rounding_minutes: number;
    at: string;
    logo_url: string;
}

export interface TogglWorkspaceProject {
    id: number;
    wid: number;
    name: string;
    at: string;
}

export interface TogglProject {
    id: number;
    wid: number;
    name: string;
    at: string;
    cid: number;
    billable: boolean;
    is_private: boolean;
    active: boolean;
    template: boolean;
    color: string; // "1" | "2" | "3" | ...
}
