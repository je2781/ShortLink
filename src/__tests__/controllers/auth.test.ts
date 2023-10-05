import mongoose from "mongoose";
import request from "supertest";
import app from "../../api";
import http from "http";
import "@testing-library/jest-dom";

require("dotenv").config();
const agent = request.agent(app); // Create an agent to maintain cookies

let server: http.Server;

describe("Authentication", () => {
  /* Connecting to the database before each test. */
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    server = app.listen(0);
  });

  it("should show validation error because user already registered", async () => {
    const response = await agent.post("/signup").send({
      fullName: "testuser",
      password: "testpassword",
      email: "test10@test.com",
      c_password: "testpassword",
    });

    expect(response.statusCode).toBe(422);
  });

  it("should log in a user", async () => {
    const response = await agent
      .post("/login")
      .send({ email: "test10@test.com", password: "testpassword" });

    expect(response.statusCode).toBe(302);
    expect(response.header.location).toBe("/");
  });

  it("should show validation error because user doesn't exist", async () => {
    const response = await agent
      .post("/login")
      .send({ email: "test100@test.com", password: "testpassword" });

    expect(response.statusCode).toBe(422);
  });

  /* Closing database connection aftAll test. */
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
});
