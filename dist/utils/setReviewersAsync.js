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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setReviewersAsync = void 0;
/**
 * Either assign or unassign reviewers
 * for a PR.
 *
 * @param {Options} options
 * @returns {Promise<{url: string} | null>}
 * The url of the PR that has had assigned/unassigned
 * reviews.
 */
function setReviewersAsync(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = options.contextPayload;
        const pullRequest = payload.pull_request;
        const repository = payload.repository;
        if (typeof pullRequest === 'undefined' || typeof repository === 'undefined') {
            throw new Error('Cannot resolve action context');
        }
        if (options.reviewers.length === 0) {
            return null;
        }
        const repoOwner = repository.owner.login;
        const pullNumber = pullRequest.number;
        const repo = repository.name;
        const prOwner = pullRequest.user.login.toLowerCase();
        console.log('PR Owner:', prOwner);
        const reviewers = options.reviewers.filter(reviewer => reviewer.toLowerCase() !== prOwner);
        console.log('Reviewers:', reviewers);
        if (reviewers.length === 0) {
            return null;
        }
        const result = options.action === 'assign'
            ? yield options.client.rest.pulls.requestReviewers({
                owner: repoOwner,
                repo,
                pull_number: pullNumber,
                reviewers
            })
            : yield options.client.rest.pulls.removeRequestedReviewers({
                owner: repoOwner,
                repo,
                pull_number: pullNumber,
                reviewers
            });
        return {
            url: result.url
        };
    });
}
exports.setReviewersAsync = setReviewersAsync;
