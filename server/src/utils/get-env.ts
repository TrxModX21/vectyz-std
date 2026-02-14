export const getEnv = (
    key: string,
    defaultValue: string | number | boolean = ""
): string | number | boolean => {
    const value = process.env[key];

    if (value === undefined) {
        if (defaultValue) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${key} is not set`);
    }

    return value;
};
