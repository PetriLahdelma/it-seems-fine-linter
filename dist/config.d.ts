export type PhraseConfig = {
    phrase: string;
    severity: number;
};
export type UserConfig = {
    threshold?: number;
    phrases?: PhraseConfig[];
};
export declare function loadConfig(path?: string): UserConfig;
