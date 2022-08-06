import allSports from "./sports";

const MY_SPORTS = ["Soccer", "Basketball", "Volleyball"];

export default async function mySports() {
    const sports = await allSports();
    return sports.filter((sport) => MY_SPORTS.includes(sport.title));
}
