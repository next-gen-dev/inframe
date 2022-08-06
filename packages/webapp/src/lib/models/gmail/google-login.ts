import {
    combineLatest,
    debounceTime,
    firstValueFrom,
    map,
    Observable,
    shareReplay,
    switchMap,
} from "rxjs";

export const gapiLoaded = new Observable<void>((subscriber) => {
    if (typeof gapi !== "undefined") {
        subscriber.next();
        return;
    }

    // if gapi is a script tag with the `defer` attribute, it should be loaded
    // once we get the `DOMContentLoaded` document event
    document.addEventListener("DOMContentLoaded", () => {
        if (typeof gapi !== "undefined") {
            subscriber.next();
        } else {
            subscriber.error(new Error("Failed to load Google gapi"));
        }
    });
}).pipe(shareReplay({ refCount: false, bufferSize: 1 }));

const authLoaded$ = gapiLoaded.pipe(
    switchMap(
        () =>
            new Observable<void>((subscriber) => {
                gapi.load("auth2", {
                    callback: () => {
                        subscriber.next();
                    },
                    onerror: (error: any) => {
                        subscriber.error(error);
                    },
                });
            }),
    ),
    shareReplay({ refCount: false, bufferSize: 1 }),
);

const authInstance$ = authLoaded$.pipe(
    map(() =>
        gapi.auth2.init({
            client_id: "{CLIENT_ID}.apps.googleusercontent.com",
            scope: "profile email https://www.googleapis.com/auth/gmail.readonly", // TODO: add email
        }),
    ),
    shareReplay({ refCount: false, bufferSize: 1 }),
);

const googleIsSignedIn$ = authInstance$.pipe(
    switchMap(
        (auth2) =>
            new Observable<boolean | undefined>((subscriber) => {
                auth2.isSignedIn.listen((isSignedIn) => {
                    subscriber.next(isSignedIn);
                });
                const currentUser = auth2.currentUser.get();
                if (!currentUser || !currentUser.isSignedIn()) {
                    subscriber.next(undefined);
                } else {
                    subscriber.next(auth2.isSignedIn.get());
                }
            }),
    ),
    shareReplay({ refCount: false, bufferSize: 1 }),
);

export const gmailCurrentUser$ = authInstance$.pipe(
    switchMap(
        (auth2) =>
            new Observable<gapi.auth2.GoogleUser>((subscriber) => {
                auth2.currentUser.listen((user) => {
                    subscriber.next(user);
                });
                if (auth2.isSignedIn.get()) {
                    subscriber.next(auth2.currentUser.get());
                }
            }),
    ),
    shareReplay({ refCount: false, bufferSize: 1 }),
);

export const isSignedIn$ = combineLatest([
    gmailCurrentUser$,
    googleIsSignedIn$,
]).pipe(
    map(([currentUser]) => {
        return currentUser ? currentUser.isSignedIn() : undefined;
    }),
    shareReplay({ refCount: false, bufferSize: 1 }),
);

export async function googleSignOut() {
    const instance = await firstValueFrom(authInstance$);
    const signOutResult = instance.signOut();
    console.log("Sign Out Result", signOutResult);
}

export async function signInWithGoogle() {
    const auth2 = await firstValueFrom(authInstance$);
    await auth2.signIn();
}
