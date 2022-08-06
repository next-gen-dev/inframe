import { requestSportsDB } from "./_sportsdb";

export interface APILeague {
    idLeague: string;
    strLeague: string;
    strSport: string;
    strLeagueAlternate: string;
}

export interface APIAllSportsResponse {
    leagues: APILeague[];
}

export default async function allLeagues() {
    const response: APIAllSportsResponse = await requestSportsDB(
        "all_leagues.php",
    );
    // return response.leagues;
    return response.leagues.map((sport: APILeague) => ({
        id: sport.idLeague,
        title: sport.strLeague,
        sport: sport.strSport,
        altTitle: sport.strLeagueAlternate,
    }));
}
