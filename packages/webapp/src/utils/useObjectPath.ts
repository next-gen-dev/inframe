import { useLocation, useParams } from "react-router-dom";

export function useObjectPath() {
    const paramsPath = useParams()["*"];
    const loc = useLocation();
    if (paramsPath) {
        const objectPath = paramsPath
            .split("/")
            .filter((item) => item && item.length > 0);
        return objectPath;
    } else {
        return (loc.pathname ?? "")
            .split("/")
            .filter((item) => item && item.length > 0);
    }
}
