"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
const shortest_1 = __importDefault(require("../routes/shortest"));
const error_1 = require("../controllers/error");
const app = (0, express_1.default)();
//parsing body of client request - for json data
app.use(body_parser_1.default.json());
//parsing body of client request - only for text requests
app.use(body_parser_1.default.urlencoded({ extended: false }));
//funneling static files request to public folder
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
//express app config settings
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
app.use(shortest_1.default);
app.use(error_1.getPageNotFound);
app.use(error_1.get500Page);
mongoose_1.default.connect(process.env.MONGODB_URI).then((_) => {
    console.log('connected to database');
    app.listen(3000);
});
// module.exports.handler = serverless(app);
