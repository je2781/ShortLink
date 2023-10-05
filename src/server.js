"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const api_1 = __importDefault(require("./api"));
mongoose_1.default.connect(process.env.MONGODB_URI).then((_) => {
    console.log("connected to database");
    api_1.default.listen(8000);
});
