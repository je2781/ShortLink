"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogout = exports.postLogin = exports.postSignup = exports.getSignup = exports.getLogin = void 0;
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const short_uuid_1 = __importDefault(require("short-uuid"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
var transport = nodemailer_1.default.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "635594c3e99ed9",
        pass: "0d447fba3f0528",
    },
});
const getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(':')[1].trim().split('=')[1] === 'true';
    res.render("auth/auth_form.ejs", {
        docTitle: "Login",
        mode: "login",
        errorMsg: null,
        path: "/login",
        oldInput: {
            email: "",
            password: "",
        },
        validationErrors: [],
    });
};
exports.getLogin = getLogin;
const getSignup = (req, res, next) => {
    res.render("auth/auth_form.ejs", {
        docTitle: "Signup",
        mode: "signup",
        errorMsg: null,
        path: "/signup",
        oldInput: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationErrors: [],
    });
};
exports.getSignup = getSignup;
const postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fName;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/auth_form.ejs", {
            docTitle: "Signup",
            mode: "signup",
            errorMsg: errors.array()[0].msg,
            path: "/signup",
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.c_password,
                fullName: fullName,
            },
            validationErrors: errors.array(),
        });
    }
    bcryptjs_1.default
        .hash(password, 12)
        .then((hashedPassword) => {
        const newUser = new user_1.default({
            email: email,
            password: hashedPassword,
            fullName: fullName,
        });
        return newUser.save();
    })
        .then(() => {
        res.redirect("/login");
        return transport.sendMail({
            from: "sender@yourdomain.com",
            to: email,
            subject: "Signup Succeeded!",
            html: "<h1>You have successfully signed up</h1>",
        });
    })
        .catch((err) => {
        return next(err);
    });
};
exports.postSignup = postSignup;
const postLogin = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/auth_form.ejs", {
            docTitle: "Login",
            mode: "login",
            errorMsg: errors.array()[0].msg,
            path: "/login",
            oldInput: {
                email: req.body.email,
                password: req.body.password,
                fullName: req.body.fName,
            },
            validationErrors: errors.array(),
        });
    }
    // Create an instance of short-uuid
    const uuidTranslator = (0, short_uuid_1.default)();
    // Generate a new short UUID
    const shortId = uuidTranslator.new();
    user_1.default.findOne({ email: req.body.email })
        .then((user) => {
        if (!user) {
            return res.status(422).render("auth/auth_form.ejs", {
                docTitle: "Login",
                mode: "login",
                errorMsg: "invalid E-mail or password",
                path: "/login",
                oldInput: {
                    email: req.body.email,
                    password: req.body.password,
                    fullName: req.body.fName,
                },
                validationErrors: [],
            });
        }
        return bcryptjs_1.default
            .compare(req.body.password, user.password)
            .then((doMatch) => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.shortId = shortId;
                req.session.user = user;
                return req.session.save(() => { });
            }
            res.status(422).render("auth/auth_form.ejs", {
                docTitle: "Login",
                mode: "login",
                errorMsg: "invalid E-mail or password",
                path: "/login",
                oldInput: {
                    email: req.body.email,
                    password: req.body.password,
                    fullName: req.body.fName,
                },
                validationErrors: [],
            });
        });
    })
        .catch((err) => {
        return next(err);
    });
};
exports.postLogin = postLogin;
const postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err)
            return next(err);
        res.redirect("/login");
    });
};
exports.postLogout = postLogout;
