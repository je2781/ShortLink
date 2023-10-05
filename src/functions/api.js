"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const path_1 = __importDefault(require("path"));
require("dotenv").config();
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
//setting up collection to store session data
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: "sessions",
});
const shortest_routes_1 = __importDefault(require("../routes/shortest.routes"));
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const error_1 = require("../controllers/error");
const app = (0, express_1.default)();
//express app config settings
app.set("view engine", "ejs");
app.set("views", "src/views");
//parsing body of client request - for json data
app.use(body_parser_1.default.json());
//parsing body of client request - only for text requests
app.use(body_parser_1.default.urlencoded({ extended: false }));
//funneling static files request to public folder
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
//configuring server session middleware
app.use((0, express_session_1.default)({
    secret: "3To6K1aCltNfmqi2",
    resave: false,
    saveUninitialized: false,
    store: store,
}));
//initializing local variables for views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});
app.use(auth_routes_1.default);
app.use(shortest_routes_1.default);
app.use(error_1.getPageNotFound);
app.use(error_1.get500Page);
exports.default = app;
// module.exports.handler = serverless(app);
