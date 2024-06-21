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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const getYamlConfigAsync_1 = require("../utils/getYamlConfigAsync");
const parseConfig_1 = require("../utils/parseConfig");
const getContextPullRequestDetails_1 = require("../utils/getContextPullRequestDetails");
const assignReviewersAsync_1 = require("../utils/assignReviewersAsync");
const unassignReviewersAsync_1 = require("../utils/unassignReviewersAsync");
const getConfigFromUrlAsync_1 = require("../utils/getConfigFromUrlAsync");
const isValidUrl_1 = require("../utils/isValidUrl");
/**
 * Assign and/or unassign reviewers using labels.
 *
 * @returns {Promise<void>}
 */
function run() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = github.getOctokit(core.getInput('repo-token', { required: true }));
            const configFilePath = core.getInput('config-file', { required: true });
            const unassignIfLabelRemoved = core.getInput('unassign-if-label-removed', {
                required: false
            });
            const contextDetails = (0, getContextPullRequestDetails_1.getContextPullRequestDetails)();
            if (contextDetails == null) {
                throw new Error('No context details');
            }
            let userConfig;
            if ((0, isValidUrl_1.isValidUrl)(configFilePath)) {
                core.debug('🔗 Retrieving config from url...');
                const configRequestHeaders = (_a = core.getInput('config-request-headers', { required: false })) !== null && _a !== void 0 ? _a : '{}';
                core.debug(`Using headers for url... ${JSON.stringify(configRequestHeaders)}`);
                userConfig = yield (0, getConfigFromUrlAsync_1.getConfigFromUrlAsync)(configFilePath, contextDetails.baseSha, JSON.parse(configRequestHeaders));
            }
            else {
                core.debug('📄 Retrieving config from yaml file...');
                userConfig = yield (0, getYamlConfigAsync_1.getYamlConfigAsync)(client, contextDetails.baseSha, configFilePath);
            }
            if (userConfig == null) {
                throw new Error('Failed to load config file');
            }
            core.debug(`Using config - ${JSON.stringify(userConfig)}`);
            const config = (0, parseConfig_1.parseConfig)(userConfig);
            const contextPayload = github.context.payload;
            core.debug('Assigning reviewers...');
            const assignedResult = yield (0, assignReviewersAsync_1.assignReviewersAsync)({
                client,
                contextDetails,
                contextPayload,
                labelReviewers: config.assign
            });
            if (assignedResult.status === 'error') {
                core.setFailed(assignedResult.message);
                return;
            }
            core.debug(`${assignedResult.status} - ${assignedResult.message}`);
            if (unassignIfLabelRemoved) {
                core.debug('Unassigning reviewers...');
                const unassignedResult = yield (0, unassignReviewersAsync_1.unassignReviewersAsync)({
                    client,
                    contextDetails: {
                        labels: contextDetails.labels,
                        baseSha: contextDetails.baseSha,
                        reviewers: [
                            ...new Set([
                                ...contextDetails.reviewers,
                                ...((_c = (_b = assignedResult.data) === null || _b === void 0 ? void 0 : _b.reviewers) !== null && _c !== void 0 ? _c : [])
                            ])
                        ]
                    },
                    contextPayload,
                    labelReviewers: config.assign
                });
                if (unassignedResult.status === 'error') {
                    core.setFailed(unassignedResult.message);
                    return;
                }
                setResultOutput('unassigned', unassignedResult);
                core.debug(`${unassignedResult.status} - ${unassignedResult.message}`);
            }
            else {
                setResultOutput('unassigned', {
                    status: 'info',
                    message: 'Skip unassigning reviewers'
                });
            }
            setResultOutput('assigned', assignedResult);
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
        }
    });
}
exports.run = run;
function setResultOutput(assignType, result) {
    var _a, _b;
    core.setOutput(`${assignType}_status`, result.status);
    core.setOutput(`${assignType}_message`, result.message);
    core.setOutput(`${assignType}_url`, (_a = result.data) === null || _a === void 0 ? void 0 : _a.url);
    core.setOutput(`${assignType}_reviewers`, (_b = result.data) === null || _b === void 0 ? void 0 : _b.reviewers);
}
