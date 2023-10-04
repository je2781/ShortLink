"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UrlMapSchema = new Schema({
    shortId: {
        type: String,
        required: true,
    },
    longUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const mapModel = mongoose_1.default.model("urlmaps", UrlMapSchema);
exports.default = mapModel;
