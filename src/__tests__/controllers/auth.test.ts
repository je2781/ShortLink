import mongoose from "mongoose";
import request from "supertest";
import app from "../../functions/api";
import "@testing-library/jest-dom";

require("dotenv").config();
const agent = request.agent(app); // Create an agent to maintain cookies

let server: any;

describe("Authentication", () => {
  /* Connecting to the database before each test. */
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    server = app.listen(8081);
  });

  /* Closing database connection aftAll test. */
  afterEach(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("should register a new user", async () => {
    const response = await agent.post("/signup").send({
      fullName: "John Doe",
      password: "server1",
      email: "test@test.com",
      c_password: "server1"
    });

    expect(response.statusCode).toBe(302);
    expect(response.header.location).toBe("/login");
  });

  it("should log in a user", async () => {
    const response = await agent
      .post("/login")
      .send({ email: "test10@test.com", password: "testpassword" });

    expect(response.statusCode).toBe(302);
    expect(response.header.location).toBe("/");
  });
});
