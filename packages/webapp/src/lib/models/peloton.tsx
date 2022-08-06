import { combineLatest, map, Observable, switchMap } from "rxjs";
import { apiRoot } from "../api";
import { DataNode, Lenses } from "../architecture/data-node";
import { liveStringLocalStorage } from "../browser";
import { DataResponse } from "../util-types";

import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import { componentIcon, IconDef } from "../icon-def";
import { ReactComponent as ArmFlexRawIcon } from "../../images/arm-flex.svg";
import { ReactComponent as HumanHandsupRawIcon } from "../../images/human-handsup.svg";
import { SvgIcon, SvgIconProps } from "@mui/material";
import { rxCache } from "../../utils/rx-cache";

function ArmFlexIcon(props: SvgIconProps) {
    return <SvgIcon {...props} component={ArmFlexRawIcon} />;
}
function HumanHandsupIcon(props: SvgIconProps) {
    return <SvgIcon {...props} component={HumanHandsupRawIcon} />;
}

// https://petershaggynoble.github.io/MDI-Sandbox/
// https://github.com/geudrik/peloton-client-library/blob/master/API_DOCS.md

const pelotonToken = liveStringLocalStorage["user.peloton.apiKey"];
const pelotonUserId = liveStringLocalStorage["user.peloton.userId"];

export interface PelotonRide {
    has_closed_captions?: boolean;
    content_provider?: "peloton" | string;
    content_format?: "video" | string;
    description?: string;
    difficulty_rating_avg?: number;
    difficulty_rating_count?: number;
    difficulty_level?: null;
    distance?: null;
    distance_display_value?: null;
    distance_unit?: null;
    duration?: number;
    dynamic_video_recorded_speed_in_mph?: number;
    extra_images?: [];
    fitness_discipline?: PelotonFitnessDiscipline;
    fitness_discipline_display_name?: "Cycling" | string;
    has_pedaling_metrics?: boolean;
    home_peloton_id?: string;
    id?: string;
    image_url?: string;
    instructor_id?: string;
    is_archived?: boolean;
    is_closed_caption_shown?: boolean;
    is_dynamic_video_eligible?: boolean;
    is_explicit?: boolean;
    is_fixed_distance?: boolean;
    is_live_in_studio_only?: boolean;
    language?: "english";
    length?: number;
    live_stream_id?: string;
    live_stream_url?: null;
    location?: "psny-studio-1" | string;
    metrics?: string[]; // ["heart_rate", "cadence", "calories"];
    origin_locale?: "en-US" | string;
    original_air_time?: number;
    overall_rating_avg?: number;
    overall_rating_count?: number;
    pedaling_start_offset?: number;
    pedaling_end_offset?: number;
    pedaling_duration?: number;
    rating?: number;
    ride_type_id?: string;
    ride_type_ids?: string[];
    sample_vod_stream_url?: null;
    sample_preview_stream_url?: null;
    scheduled_start_time?: number;
    series_id?: string;
    sold_out?: boolean;
    studio_peloton_id?: string;
    title?: string;
    total_ratings?: number;
    total_in_progress_workouts?: number;
    total_workouts?: number;
    vod_stream_url?: string;
    vod_stream_id?: string;
    class_type_ids?: [string];
    difficulty_estimate?: number;
    overall_estimate?: number;
    availability?: {
        is_available?: boolean;
        reason?: null;
    };
    explicit_rating?: number;
}

export type PelotonFitnessDiscipline =
    | "cycling"
    | "strength"
    | "stretching"
    | string;

export interface PelotonWorkout {
    created_at?: number;
    device_type?: "home_bike_v1" | string;
    end_time?: number;
    fitness_discipline?: PelotonFitnessDiscipline;
    has_pedaling_metrics?: boolean;
    has_leaderboard_metrics?: boolean;
    id: string;
    is_total_work_personal_record?: boolean;
    metrics_type?: "cycling" | string; // cycling
    name?: "Cycling Workout" | string;
    peloton_id?: string;
    platform?: "home_bike" | string;
    start_time?: number;
    status?: "COMPLETE" | string; // COMPLETE
    timezone?: string;
    title?: null;
    total_work?: number;
    user_id?: string;
    workout_type?: "class" | string;
    total_video_watch_time_seconds?: number;
    total_video_buffering_seconds?: number;
    v2_total_video_watch_time_seconds?: number;
    v2_total_video_buffering_seconds?: number;
    total_music_audio_play_seconds?: null;
    total_music_audio_buffer_seconds?: null;
    created?: number;
    device_time_created_at?: number;
    strava_id?: null;
    fitbit_id?: null;
    effort_zones?: null;
    ride?: PelotonRide;
    // ride?: {
    //     id?: string;
    //     is_archived?: boolean;
    //     instructor?: {
    //         name?: string;
    //         image_url?: string;
    //     };
    //     title?: string;
    //     scheduled_start_time?: number;
    //     duration?: number;
    // };
}

async function getPelotonWorkouts(token: string, userId: string) {
    try {
        const res = await fetch(
            `${apiRoot}/peloton/user/${userId}/workouts?joins=ride&limit=50`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );
        // has more than just data
        const json: DataResponse<any[]> = await res.json();
        return json.data;
        // const projectIds = json
        //     .map((item) => item.pid)
        //     .filter((v, i, a) => a.indexOf(v) === i);
        // return json.map((entry) => ({
        //     id: `${entry.id}`,
        //     title: entry.description ?? "",
        //     image: entry.color ? colorIcon(entry.color) : undefined,
        // }));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export const pelotonWorkouts$ = combineLatest([
    pelotonToken.$,
    pelotonUserId.$,
]).pipe(
    switchMap(
        async ([token, userId]): Promise<PelotonWorkout[]> =>
            token && userId ? getPelotonWorkouts(token, userId) : [],
    ),
    rxCache(),
);

function workoutIcon(workout: PelotonWorkout): IconDef | undefined {
    switch (workout.fitness_discipline) {
        case "cycling":
            // return emojiIcon("🚲");
            return componentIcon(DirectionsBikeIcon);
        case "strength":
            return componentIcon(ArmFlexIcon);
        case "stretching":
            return componentIcon(HumanHandsupIcon);
    }
    return undefined;
}

export const pelotonWorkoutLenses: Lenses<PelotonWorkout> = {
    // TODO: userId
    id: (w) => `peloton/workouts/${w.id}`,
    listItem: (w) => ({
        id: w.id,
        title: w.ride?.title ?? "",
        image: workoutIcon(w),
    }),
};

export const pelotonWorkoutNodes$: Observable<DataNode[]> =
    pelotonWorkouts$.pipe(
        map((workouts) =>
            workouts.map(
                (workout): DataNode => ({
                    data: workout,
                    lenses: pelotonWorkoutLenses,
                }),
            ),
        ),
    );
