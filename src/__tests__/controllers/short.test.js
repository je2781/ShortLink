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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const api_1 = __importDefault(require("../../functions/api"));
require("@testing-library/jest-dom");
require("dotenv").config();
const agent = supertest_1.default.agent(api_1.default); // Create an agent to maintain cookies
describe("short route", () => {
    let server;
    /* Connecting to the database before all tests. */
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        server = api_1.default.listen(8080);
    }));
    /* Closing database connection and server after all tests. */
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        server.close();
    }));
    it("should redirect to success page after generating a shortened URL", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent
            .post("/encode")
            .send({
            longUrl: "https://example.com",
        });
        expect(res.statusCode).toBe(302);
        expect(res.header.location).toBe("/success");
    }));
    it("should redirect to original URL", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield agent
            .get("/decode/qbzTGVJoLrqLQZfNXHDgwf");
        expect(res.statusCode).toBe(302);
        expect(res.header.location).toBe("https://example.com");
    }));
});
