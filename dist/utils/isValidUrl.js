"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrl = void 0;
/**
 * Check whether the value is a valid url.
 *
 * @param {string} value - The potential url.
 * @returns {boolean}
 * Whether the value is a url and is valid
 */
function isValidUrl(value) {
    try {
        new URL(value);
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.isValidUrl = isValidUrl;
