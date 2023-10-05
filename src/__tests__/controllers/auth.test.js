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
let server;
describe("Authentication", () => {
    /* Connecting to the database before each test. */
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        server = api_1.default.listen(0);
    }));
    it("should show validation error because user already registered", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent.post("/signup").send({
            fullName: "testuser",
            password: "testpassword",
            email: "test10@test.com",
            c_password: "testpassword",
        });
        expect(response.statusCode).toBe(422);
    }));
    it("should register new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent.post("/signup").send({
            fullName: "John Doe",
            password: "server1",
            email: "test@test.com",
            c_password: "server1",
        });
        expect(response.statusCode).toBe(302);
        expect(response.header.location).toBe("/login");
    }));
    it("should log in a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .post("/login")
            .send({ email: "test10@test.com", password: "testpassword" });
        expect(response.statusCode).toBe(302);
        expect(response.header.location).toBe("/");
    }));
    it("should show validation error because user doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .post("/login")
            .send({ email: "test100@test.com", password: "testpassword" });
        expect(response.statusCode).toBe(422);
    }));
    /* Closing database connection aftAll test. */
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        server.close();
    }));
});
