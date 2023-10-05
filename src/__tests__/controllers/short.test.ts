import mongoose from "mongoose";
import request from "supertest";
import app from "../../functions/api";
import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import http from "http";
import path from "path";
import ejs from "ejs";
import fs from "fs";

const successFilePath = path.resolve(__dirname, "../../views/success_mock.ejs");
const homeFilePath = path.resolve(__dirname, "../../views/home_mock.ejs");

require("dotenv").config();
const agent = request.agent(app); // Create an agent to maintain cookies

describe("short route", () => {
  let server: http.Server;
  let cookies: any;
  /* Connecting to the database before all tests. */
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    server = app.listen(0); // Use 0 to automatically assign an available port

    const res = await agent
      .post("/login") // Replace with your authentication route
      .send({ email: "test10@test.com", password: "testpassword" });

    // Parse and store the session cookies
    const setCookieHeader = res.headers["set-cookie"];
    if (Array.isArray(setCookieHeader)) {
      cookies = setCookieHeader.map((cookieStr) => cookieStr.split(";")[0]);
    } else if (typeof setCookieHeader === "string") {
      cookies = [setCookieHeader.split(";")[0]];
    }
  });

  it("should redirect to success page after generating a shortened URL", async () => {
    // Set each session cookie in the request headers
    cookies.forEach((cookie: string[]) => {
      agent.set("Cookie", cookie);
    });
    const res = await agent.post("/encode").send({
      longUrl: "https://example.com",
    });
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/success");
  });

  it("should redirect to original URL", async () => {
    // Set each session cookie in the request headers
    cookies.forEach((cookie: string[]) => {
      agent.set("Cookie", cookie);
    });
    const res = await agent.get("/decode/8uTXFGtnp91ByL5KUMHtEB");
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("https://example.com");
  });

  it("should return stats about shortened url path", async () => {
    // Set each session cookie in the request headers
    cookies.forEach((cookie: string[]) => {
      agent.set("Cookie", cookie);
    });
    const res = await agent.get("/statistic/8uTXFGtnp91ByL5KUMHtEB");
    expect(res.statusCode).toBe(302);
    expect(res.body.createdAt).toBe("10/5/2023");
    expect(res.body.originalUrl).toBe("https://example.com");
    expect(res.body.hasEncryption).toBe(true);
  });

  /* Closing database connection aftAll test. */
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
});

describe("Success page", () => {
  let dom: JSDOM;
  let container: HTMLElement;

  // Define your dynamic data
  const dynamicData = {
    isAuthenticated: true,
    docTitle: "Success",
    path: "/logout",
    shortId: "jsc86rG9B8bygdvBDM9vxy",
  };

  beforeAll((done) => {
    fs.readFile(successFilePath, "utf8", (err, template) => {
      if (err) {
        return done(err);
      }

      // Render the EJS template with the dynamic data
      const renderedHtml = ejs.render(template, dynamicData);
      dom = new JSDOM(renderedHtml, { runScripts: "dangerously" });
      container = dom.window.document.body;

      done();
    });
  });

  test("should show links and badge", () => {
    // Check if container is defined before using querySelector
    expect(container).toBeDefined();
    expect(container.querySelector(".fa-circle-check")).toBeInTheDocument();
    expect(container.querySelector("a[href^='/decode']")).toBeInTheDocument();
    expect(
      container.querySelector("a[href^='/statistic']")
    ).toBeInTheDocument();
  });
});

describe("Home page", () => {
  let dom: JSDOM;
  let container: HTMLElement;

  // Define your dynamic data
  const dynamicData = {
    isAuthenticated: true,
    hasErrorMsg: false,
    hasMsg: false,
    Msg: null,
    docTitle: "Home page",
    path: "/logout",
    validationErrors: [],
  };

  beforeAll((done) => {
    fs.readFile(homeFilePath, "utf8", (err, template) => {
      if (err) {
        return done(err);
      }

      // Render the EJS template with the dynamic data
      const renderedHtml = ejs.render(template, dynamicData);
      dom = new JSDOM(renderedHtml, { runScripts: "dangerously" });
      container = dom.window.document.body;

      done();
    });
  });

  test("should show url form with elements", () => {
    // Check if container is defined before using querySelector
    expect(container).toBeDefined();
    expect(container.querySelector("#longUrl")).toBeInTheDocument();
    expect(container.querySelector("button")).toBeInTheDocument();
  });
});
