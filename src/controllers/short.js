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
exports.decode = exports.getSuccess = exports.encode = exports.getStats = exports.getHomePage = void 0;
const urlmap_1 = __importDefault(require("../models/urlmap"));
const express_validator_1 = require("express-validator");
const getHomePage = (req, res, next) => {
    res.status(200).render("home", {
        docTitle: "Shortlink",
        path: "/",
        hasErrorMsg: false,
        hasMsg: false,
        Msg: null,
        validationErrors: [],
    });
};
exports.getHomePage = getHomePage;
const getStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const shortId = req.params.shortid;
    const map = yield urlmap_1.default.findOne({ shortId: shortId });
    if (!map) {
        const error = new Error("url pairing not found!");
        return next(error);
    }
    res.status(302).json({
        createdAt: map.createdAt.toLocaleDateString("en-US"),
        originalUrl: map.longUrl,
        hasEncryption: map.longUrl.includes('https') ? true : false
    });
});
exports.getStats = getStats;
const encode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("home", {
            docTitle: "Shortlink",
            path: "/",
            Msg: errors.array()[0].msg,
            hasErrorMsg: true,
            hasMsg: false,
            validationErrors: errors.array(),
        });
    }
    const longUrl = req.body.longUrl;
    //collection for storing URL mappings
    const map = new urlmap_1.default({
        shortId: req.session.shortId,
        longUrl: longUrl,
    });
    try {
        yield map.save();
    }
    catch (err) {
        return next(err);
    }
    finally {
        res.status(302).redirect("/success");
    }
});
exports.encode = encode;
const getSuccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).render("success", {
        docTitle: "Success",
        path: "/success",
        shortId: req.session.shortId,
    });
});
exports.getSuccess = getSuccess;
// Create a route for redirecting short URLs
const decode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortId = req.params.shortid;
        const map = yield urlmap_1.default.findOne({ shortId: shortId });
        if (!map) {
            const error = new Error("url pairing not found!");
            return next(error);
        }
        const longUrl = map.longUrl;
        if (longUrl) {
            res.status(302).redirect(longUrl);
        }
        else {
            res.status(404).json({ error: "URL not found" });
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.decode = decode;
