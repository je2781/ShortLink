import mongoose from "mongoose";
import request from "supertest";
import app from "../../functions/api";
import "@testing-library/jest-dom";

require("dotenv").config();
const agent = request.agent(app); // Create an agent to maintain cookies

describe("short route", () => {
  let server: any;

  /* Connecting to the database before all tests. */
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    server = app.listen(8080);
  });

  /* Closing database connection and server after all tests. */
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("should redirect to success page after generating a shortened URL", async () => {
    const res = await agent
      .post("/encode")
      .send({
        longUrl: "https://example.com",
      });
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/success");
  });

  it("should redirect to original URL", async () => {
    const res = await agent
      .get("/decode/qbzTGVJoLrqLQZfNXHDgwf");
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("https://example.com");
  });

  it("should return stats about shortened url path", async () => {
    const res = await agent
      .get("/statistic/qbzTGVJoLrqLQZfNXHDgwf");
    expect(res.statusCode).toBe(200);
    expect(res.body.createdAt).toBe("10/4/2023");
    expect(res.body.originalUrl).toBe("https://example.com");
    expect(res.body.hasEncryption).toBe(true);
  });
});
