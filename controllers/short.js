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
exports.decode = exports.encode = exports.getHomePage = void 0;
const short_uuid_1 = __importDefault(require("short-uuid"));
const urlmap_1 = __importDefault(require("../models/urlmap"));
const express_validator_1 = require("express-validator");
const getHomePage = (req, res, next) => {
    res.render("home", {
        docTitle: "Shortlink",
        path: "/",
        hasErrorMsg: false,
        hasMessage: false,
        Msg: null,
        validationErrors: [],
    });
};
exports.getHomePage = getHomePage;
const encode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("home", {
            docTitle: "Shortlink",
            path: "/",
            editing: "true",
            Msg: errors.array()[0].msg,
            hasErrorMsg: true,
            hasMessage: false,
            validationErrors: errors.array(),
        });
    }
    // Create an instance of short-uuid
    const uuidTranslator = (0, short_uuid_1.default)();
    // Generate a new short UUID
    const shortId = uuidTranslator.new();
    let shortUrl = "";
    const longUrl = req.body.longUrl;
    if (longUrl.includes("https")) {
        shortUrl = "https://short.est/" + shortId;
    }
    else {
        shortUrl = "http://short.est/" + shortId;
    }
    //collection for storing URL mappings
    const map = new urlmap_1.default({
        short: shortUrl,
        long: longUrl,
    });
    try {
        yield map.save();
    }
    catch (err) {
        if (!err.code) {
            err.code = 500;
        }
        return next(err);
    }
    finally {
        res
            .status(201)
            .json({ encodedUrl: shortUrl, message: "url successfully shortened" });
    }
});
exports.encode = encode;
// Create a route for redirecting short URLs
const decode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrl = req.params.shortUrl;
        const map = yield urlmap_1.default.findOne({ short: shortUrl });
        if (!map) {
            const error = new Error("url pairing not found!");
            return next(error);
        }
        const longUrl = map.long;
        if (longUrl) {
            res.redirect(longUrl);
        }
        else {
            res.status(404).json({ error: "URL not found" });
        }
    }
    catch (err) {
        if (!err.code) {
            err.code = 500;
        }
        return next(err);
    }
});
exports.decode = decode;
