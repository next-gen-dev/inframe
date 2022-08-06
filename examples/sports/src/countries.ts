import fetch from "cross-fetch";

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

export default async function countries(): Promise<Country[]> {
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
        }),
    });
    const data = await res.json();
    return data.data.countries;
}
