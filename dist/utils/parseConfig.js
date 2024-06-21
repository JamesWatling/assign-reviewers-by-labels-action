"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfig = void 0;
const zod_1 = require("zod");
const config_1 = require("../config");
/**
 * Validate and parse the config so it can be
 * used by the application.
 *
 * @param {unknown} config - The potential
 * config file for the action.
 * @returns {Config}
 * The parsed config file for the action.
 */
function parseConfig(config) {
    try {
        if (config_1.ConfigSchema.parse(config)) {
            const parsedConfig = config;
            parsedConfig.assign = dedupeLabelReviewers(Object.assign({}, parsedConfig.assign));
            return parsedConfig;
        }
        return config;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const validationError = error;
            throw new Error(validationError.errors[0].message);
        }
        throw new Error('Failed to parse the config');
    }
}
exports.parseConfig = parseConfig;
/**
 * Scrub the list of reviewers for each label so its a unique list of
 * reviewers.
 *
 * @param {Config['assign']} assign - The assign object which contains the
 * labels and the list of reviewers for each label.
 * @returns {Config['assign']}
 * The assign object with each label containing the unique list of reviewers.
 */
function dedupeLabelReviewers(assign) {
    return Object.keys(assign).reduce((parsed, label) => {
        parsed[label] = [...new Set(assign[label])];
        return parsed;
    }, {});
}
