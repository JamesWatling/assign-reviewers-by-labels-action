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
exports.unassignReviewersAsync = void 0;
const setReviewersAsync_1 = require("./setReviewersAsync");
/**
 * Determine the reviewers that should be removed
 * depending on the state of the PR. Then, request
 * to remove those reviewers from the PR.
 *
 * @param {Options} options
 * @returns {Promise<AssignReviewersReturn}
 * The status of whether the reviewers were unassigned
 * as well as data containing those reviewers.
 */
function unassignReviewersAsync({ client, labelReviewers, contextDetails, contextPayload }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (contextDetails == null) {
            return {
                status: 'error',
                message: 'No action context'
            };
        }
        const labels = Object.keys(labelReviewers);
        const reviewersByLabelInclude = [];
        const reviewersByLabelMiss = [];
        for (const label of labels) {
            if (!contextDetails.labels.includes(label)) {
                reviewersByLabelMiss.push(...labelReviewers[label]);
            }
            else {
                reviewersByLabelInclude.push(...labelReviewers[label]);
            }
        }
        if (reviewersByLabelMiss.length === 0) {
            return {
                status: 'info',
                message: 'No reviewers to unassign'
            };
        }
        let reviewersToUnassign = [];
        if (contextDetails.labels.length === 0) {
            reviewersToUnassign = [
                ...new Set([...reviewersByLabelMiss, ...reviewersByLabelInclude])
            ];
        }
        else {
            reviewersToUnassign = reviewersByLabelMiss.filter(reviewer => !reviewersByLabelInclude.includes(reviewer));
        }
        if (reviewersToUnassign.length === 0) {
            return {
                status: 'info',
                message: 'No reviewers to unassign'
            };
        }
        const result = yield (0, setReviewersAsync_1.setReviewersAsync)({
            client,
            reviewers: reviewersToUnassign,
            contextPayload,
            action: 'unassign'
        });
        if (result == null) {
            return {
                status: 'info',
                message: 'No reviewers to unassign'
            };
        }
        return {
            status: 'success',
            message: 'Reviewers have been unassigned',
            data: { url: result.url, reviewers: reviewersToUnassign }
        };
    });
}
exports.unassignReviewersAsync = unassignReviewersAsync;
