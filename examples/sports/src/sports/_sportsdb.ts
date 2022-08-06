import fetch from "cross-fetch";

export const API_KEY = "2";
export const ROOT_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/`;

export async function requestSportsDB(path: string, method: string = "GET") {
    const response = await fetch(`${ROOT_URL}${path}`);
    return response.json();
}

// List all leagues
// https://www.thesportsdb.com/api/v1/json/2/all_leagues.php

// List all Seasons in a League
// https://www.thesportsdb.com/api/v1/json/2/search_all_seasons.php?id=4328

// All events in specific league by season (Free tier limited to 100 events)
// https://www.thesportsdb.com/api/v1/json/2/eventsseason.php?id=4328&s=2014-2015
