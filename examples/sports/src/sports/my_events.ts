import myLeagues from "./my_leagues";
import { requestSportsDB } from "./_sportsdb";

export interface APIEvent {
    idEvent: string;
    idSoccerXML: string;
    idAPIfootball: null;
    strEvent: string;
    strEventAlternate: string;
    strFilename: string;
    strSport: string;
    idLeague: string;
    strLeague: string;
    strSeason: string;
    strDescriptionEN: null;
    strHomeTeam: string;
    strAwayTeam: string;
    intHomeScore: string;
    intRound: string;
    intAwayScore: string;
    intSpectators: string;
    strOfficial: null;
    strTimestamp: null;
    dateEvent: string;
    dateEventLocal: null;
    strTime: string;
    strTimeLocal: null;
    strTVStation: null;
    idHomeTeam: string;
    idAwayTeam: string;
    intScore: null;
    intScoreVotes: null;
    strResult: null;
    strVenue: null;
    strCountry: null;
    strCity: null;
    strPoster: null;
    strSquare: null;
    strFanart: null;
    strThumb: null;
    strBanner: null;
    strMap: null;
    strTweet1: null;
    strTweet2: null;
    strTweet3: null;
    strVideo: null;
    strStatus: null;
    strPostponed: string;
    strLocked: string;
}

export interface APIEventsResponse {
    events: APIEvent[];
}

export async function leagueSeasonEvents(leagueId: string, season: string) {
    const response: APIEventsResponse = await requestSportsDB(
        `eventsseason.php?id=${leagueId}&s=${season}`,
    );
    return (response.events ?? []).slice(0, 10);
}

export default async function myEvents() {
    const leagues = await myLeagues();
    let events: APIEvent[] = [];
    for (let league of leagues) {
        events = events.concat(
            await leagueSeasonEvents(league.id, league.currentSeason),
        );
    }
    return events.map((event) => ({
        id: event.idEvent,
        title: event.strEvent,
        sport: event.strSport,
        date: event.dateEvent,
        time: event.strTime,
        league: event.strLeague,
    }));
}
