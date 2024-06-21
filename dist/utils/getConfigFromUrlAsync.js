"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigFromUrlAsync = void 0;
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
/**
 * Retrieve the config from the url.
 *
 * @param {string} configUrl - The url to retrieve the config from.
 * @param {string} ref - The name of the commit/branch/tag.
 * @param {Record<string, string>} headers - The request headers to add to the request.
 * @returns {Promise<TConfig | null>}
 * The json config from the url
 */
function getConfigFromUrlAsync(configUrl, ref, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, isomorphic_fetch_1.default)(configUrl, {
                method: 'GET',
                headers: Object.assign({ 'content-type': 'application/json' }, headers)
            });
            if (response.status >= 200 && response.status <= 299) {
                const json = yield response.json();
                return json;
            }
            throw new Error(`Response status (${response.status}) from ${configUrl}`);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to load configuration for sha "${ref}" - ${error.message}`);
            }
            return null;
        }
    });
}
exports.getConfigFromUrlAsync = getConfigFromUrlAsync;
