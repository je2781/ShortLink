import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import serverless from "serverless-http";
import path from "path";
import mongoose from "mongoose";
require("dotenv").config();

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI!,
  collection: "sessions",
});

import shortRoutes from "../routes/shortest";
import authRoutes from "../routes/auth";
import { get500Page, getPageNotFound } from "../controllers/error";

const app = express();

//express app config settings
app.set("view engine", "ejs");
app.set("views", "views");

//parsing body of client request - for json data
app.use(bodyParser.json());
//parsing body of client request - only for text requests
app.use(bodyParser.urlencoded({ extended: false }));
//funneling static files request to public folder
app.use(express.static(path.join(__dirname, "..", "public")));
//configuring server session middleware
app.use(
  session({
    secret: "3To6K1aCltNfmqi2",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//initializing local variables for views
app.use((req: any, res: any, next: any) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(authRoutes);
app.use(shortRoutes);

app.use(getPageNotFound);
app.use(get500Page);

mongoose.connect(process.env.MONGODB_URI!).then((_) => {
  console.log("connected to database");
  app.listen(8000);
});

// module.exports.handler = serverless(app);
