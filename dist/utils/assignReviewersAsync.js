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
exports.assignReviewersAsync = void 0;
const setReviewersAsync_1 = require("./setReviewersAsync");
/**
 * Determine the reviewers that should be
 * added depending on the state of the PR. Then,
 * request to add those reviewers to the PR.
 *
 * @param {Options} options
 * @returns {Promise<AssignReviewersReturn>}
 * The status of whether the reviewers were assigned
 * as well as data containing those reviewers.
 */
function assignReviewersAsync({ client, labelReviewers, contextDetails, contextPayload }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (contextDetails == null) {
            return {
                status: 'error',
                message: 'No action context'
            };
        }
        const labels = Object.keys(labelReviewers);
        const reviewersByLabels = [];
        for (const label of labels) {
            if (contextDetails.labels.includes(label)) {
                reviewersByLabels.push(...labelReviewers[label]);
            }
        }
        const reviewersToAssign = [...new Set(reviewersByLabels)];
        if (reviewersToAssign.length === 0) {
            return {
                status: 'info',
                message: 'No reviewers to assign from the labels provided'
            };
        }
        const diffNewReviewers = reviewersToAssign.filter(reviewer => !contextDetails.reviewers.includes(reviewer));
        if (diffNewReviewers.length === 0) {
            return {
                status: 'info',
                message: 'No new reviewers to assign'
            };
        }
        const result = yield (0, setReviewersAsync_1.setReviewersAsync)({
            client,
            reviewers: reviewersToAssign,
            contextPayload,
            action: 'assign'
        });
        if (result == null) {
            return {
                status: 'info',
                message: 'No reviewers to assign'
            };
        }
        return {
            status: 'success',
            message: 'Reviewers have been assigned',
            data: { url: result.url, reviewers: reviewersToAssign }
        };
    });
}
exports.assignReviewersAsync = assignReviewersAsync;
