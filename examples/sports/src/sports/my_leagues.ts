import allLeagues, { APILeague } from "./leagues";
import { requestSportsDB } from "./_sportsdb";

const MY_SPORTS = ["Soccer", "Basketball", "Volleyball"];
const MY_COUNTRIES = ["Brazil", "England"];

export interface APISearchedLeague {
    idLeague: string;
    idSoccerXML: null;
    idAPIfootball: string;
    strSport: string;
    strLeague: string;
    strLeagueAlternate: string;
    intDivision: string;
    idCup: string;
    strCurrentSeason: string;
    intFormedYear: string;
    dateFirstEvent: string;
    strGender: "Male" | "Female" | string | null;
    strCountry: string;
    strWebsite: string;
    strFacebook: "";
    strInstagram: "";
    strTwitter: "";
    strYoutube: "";
    strRSS: "";
    strDescriptionEN: string | null;
    strDescriptionDE: string | null;
    strDescriptionFR: string | null;
    strDescriptionIT: string | null;
    strDescriptionCN: string | null;
    strDescriptionJP: string | null;
    strDescriptionRU: string | null;
    strDescriptionES: string | null;
    strDescriptionPT: string | null;
    strDescriptionSE: string | null;
    strDescriptionNL: string | null;
    strDescriptionHU: string | null;
    strDescriptionNO: string | null;
    strDescriptionPL: string | null;
    strDescriptionIL: string | null;
    strTvRights: null;
    strFanart1: string | null;
    strFanart2: string | null;
    strFanart3: string | null;
    strFanart4: string | null;
    strBanner: null;
    strBadge: string;
    strLogo: string;
    strPoster: null;
    strTrophy: null;
    strNaming: string;
    strComplete: null;
    strLocked: string;
}

export interface APILeagueSearchResponse {
    countrys: APISearchedLeague[];
}

async function countryLeagues(country: string, sport: string) {
    // TODO: handle URL injection. probably not a huge issue, but still
    const response: APILeagueSearchResponse = await requestSportsDB(
        `search_all_leagues.php?c=${country}&s=${sport}`,
    );
    return response.countrys;
}

export default async function myLeagues() {
    // TODO: parallel (currently the API limits probably won't allow parallel execution)
    let leagues: APISearchedLeague[] = [];
    for (let country of MY_COUNTRIES) {
        for (let sport of MY_SPORTS) {
            leagues = leagues.concat(await countryLeagues(country, sport));
        }
    }
    return leagues
        .filter((league) => !!league)
        .map((league) => ({
            id: league.idLeague,
            icon: league.strBadge,
            title: league.strLeague,
            sport: league.strSport,
            currentSeason: league.strCurrentSeason,
            country: league.strCountry,
        }));
    // const leagues = await allLeagues();
    // return leagues.filter((league) => MY_SPORTS.includes(league.sport));
}
