import { requestSportsDB } from "./_sportsdb";

export interface APISport {
    idSport: string;
    strSport: string;
    strFormat: string;
    strSportThumb: string;
    strSportIconGreen: string;
    strSportDescription: string;
}

export interface APIAllSportsResponse {
    sports: APISport[];
}

export default async function allSports() {
    const response: APIAllSportsResponse = await requestSportsDB(
        "all_sports.php",
    );
    return response.sports.map((sport: APISport) => ({
        id: sport.idSport,
        icon: sport.strSportIconGreen,
        title: sport.strSport,
        format: sport.strFormat,
        thumbnail: sport.strSportThumb,
    }));
}
