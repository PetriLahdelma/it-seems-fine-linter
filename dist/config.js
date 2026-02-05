import fs from "node:fs";
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
export function loadConfig(path) {
    if (!path)
        return {};
    if (!fs.existsSync(path)) {
        throw new Error(`Config not found: ${path}`);
    }
    const raw = fs.readFileSync(path, "utf8");
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        throw new Error(`Config is not valid JSON: ${path}`);
    }
    if (!isRecord(parsed)) {
        throw new Error(`Config must be an object: ${path}`);
    }
    const config = parsed;
    if (config.threshold !== undefined) {
        if (typeof config.threshold !== "number" || Number.isNaN(config.threshold)) {
            throw new Error(`Config threshold must be a number: ${path}`);
        }
    }
    if (config.phrases !== undefined) {
        if (!Array.isArray(config.phrases)) {
            throw new Error(`Config phrases must be an array: ${path}`);
        }
        for (const [index, phrase] of config.phrases.entries()) {
            if (!isRecord(phrase)) {
                throw new Error(`Config phrases[${index}] must be an object: ${path}`);
            }
            if (typeof phrase.phrase !== "string" || phrase.phrase.trim() === "") {
                throw new Error(`Config phrases[${index}].phrase must be a non-empty string: ${path}`);
            }
            if (typeof phrase.severity !== "number" || Number.isNaN(phrase.severity)) {
                throw new Error(`Config phrases[${index}].severity must be a number: ${path}`);
            }
        }
    }
    return config;
}
//# sourceMappingURL=config.js.map