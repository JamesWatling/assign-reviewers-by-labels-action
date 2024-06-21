"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getYamlConfigAsync = void 0;
const js_yaml_1 = __importDefault(require("js-yaml"));
const github = __importStar(require("@actions/github"));
/**
 * Retrieve the file contents from a github repo.
 *
 * @param {Client} client - The github client.
 * @param {string} ref - The name of the commit/branch/tag.
 * @param {string} contentPath - The path to the file.
 * @returns {Promise<string>}
 * The contents of the file.
 */
function getFileContents(client, ref, contentPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield client.rest.repos.getContent({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: contentPath,
            ref
        });
        if (result.status !== 200) {
            throw new Error(`Failed ${result.status} ${ref.slice(0, 7)} ${contentPath}`);
        }
        const data = result.data;
        if (!data.content) {
            throw new Error(`No content ${ref.slice(0, 7)} ${contentPath}`);
        }
        return Buffer.from(data.content, 'base64').toString();
    });
}
/**
 * Retrieve the yaml config from a path.
 *
 * @param {Client} client - The github client.
 * @param {string} ref - The name of the commit/branch/tag.
 * @param {string} contentPath - The path to the file.
 * @returns {Promise<TConfig | void>}
 * The contents of the yaml config
 */
function getYamlConfigAsync(client, ref, contentPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contents = yield getFileContents(client, ref, contentPath);
            return js_yaml_1.default.load(contents, { filename: contentPath });
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to load configuration ${ref.slice(0, 7)} ${error.message} ${contentPath}`);
            }
            return null;
        }
    });
}
exports.getYamlConfigAsync = getYamlConfigAsync;
