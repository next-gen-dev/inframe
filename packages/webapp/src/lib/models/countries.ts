import { Observable } from "rxjs";
import { DataNode, Lenses } from "../architecture/data-node";
import { NewConnectionDefinition } from "./sources";
import { emojiIcon } from "../icon-def";
import { liveRefreshable } from "../refreshable";

export type Country = {
    code: string;
    emoji: string;
    name: string;
    native: string;
    phone: string;
    continent: {
        code: string;
        name: string;
    };
    capital: string;
    currency: string;
    languages: {
        code: string;
        name: string;
        native: string;
        rtl: boolean;
    }[];
    emojiU: string;
    states: {
        code?: string;
        name: string;
    }[];
};

export const countriesLenses: Lenses<Country> = {
    id: (kvp) => kvp.code,
    listItem: (kvp) => ({
        id: kvp.code,
        title: kvp.name,
        image: emojiIcon(kvp.emoji),
    }),
};

export const countriesConnectionDef: NewConnectionDefinition = {
    display: {
        id: "countries",
        title: "Countries",
        image: emojiIcon("🌎"),
    },
    resolvableType: "countries",
};

export const countriesNodes$: Observable<DataNode<Country>[]> = liveRefreshable(
    async () => {
        var query = `query {
        countries {
          code,
          emoji,
          name,
          native,
          phone,
          continent {
            code,
            name,
          }
          capital,
          currency,
          languages {
            code,
            name,
            native,
            rtl,
          }
          emojiU,
          states {
            code,
            name
          }
        }
      }`;

        const res = await fetch("https://countries.trevorblades.com/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query,
                // variables: { },
            }),
        });
        const data = await res.json();
        return data.data.countries.map(
            (country: Country): DataNode<Country> => ({
                data: country,
                lenses: countriesLenses,
            }),
        );
    },
).$;
// localStorageKeys$.$.pipe(
//     switchMap((keys) =>
//         combineLatest(
//             keys.map((key) =>
//                 liveStringLocalStorage[key].$.pipe(
//                     map((value) => ({
//                         data: {
//                             key,
//                             value,
//                         },
//                         lenses: localStorageLenses,
//                     })),
//                 ),
//             ),
//         ),
//     ),
// );

// export const pelotonWorkoutNodes$: Observable<DataNode[]> =
//     pelotonWorkouts$.pipe(
//         map((workouts) =>
//             workouts.map(
//                 (workout): DataNode => ({
//                     data: workout,
//                     lenses: pelotonWorkoutLenses,
//                 }),
//             ),
//         ),
//     );
