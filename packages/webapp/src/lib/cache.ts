type CachedObject<T> = { [key: string]: T };

export const cachedObject = <T>(getter: (key: string) => T) => {
    return new Proxy<CachedObject<T>>(
        {},
        {
            get: (target: CachedObject<T>, key: string): T => {
                // TODO: key might be able to be undefined
                if (target[key] !== undefined) {
                    return target[key];
                }
                const value = getter(key);
                target[key] = value;
                return value;
            },
        },
    );
};
