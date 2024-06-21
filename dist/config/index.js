"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.ConfigSchema = zod_1.default.object({
    assign: zod_1.default.record(zod_1.default
        .array(zod_1.default.string({
        required_error: '"reviewer" array must contain a valid reviewer or reviewers',
        invalid_type_error: '"reviewer" array must contain a valid reviewer or reviewers'
    }), {
        required_error: '"assign" labels must contain an array of reviewers',
        invalid_type_error: '"assign" labels must contain an array of reviewers'
    })
        .min(1, '"assign" must have at least one reviewer'), {
        required_error: '"assign" must be an object with the label as the key and the reviewers as an array',
        invalid_type_error: '"assign" be an object with the label as the key and the reviewers as an array'
    })
}, {
    required_error: 'Config must have an "assign" object of labels',
    invalid_type_error: 'Config must have an "assign" object of labels'
});
