import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import short from "short-uuid";
import User from "../models/user";
import bcrypt from "bcryptjs";

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "635594c3e99ed9",
    pass: "0d447fba3f0528",
  },
});

export const getLogin = (req: any, res: any, next: any) => {
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

export const getSignup = (req: any, res: any, next: any) => {
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

export const postSignup = (req: any, res: any, next: any) => {
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fName;
  const errors = validationResult(req);

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

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
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

export const postLogin = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
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
  const uuidTranslator = short();

  // Generate a new short UUID
  const shortId = uuidTranslator.new();

  User.findOne({ email: req.body.email })
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
      return bcrypt
        .compare(req.body.password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.shortId = shortId;
            req.session.user = user;
            return req.session.save(() => {});
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

export const postLogout = (req: any, res: any, next: any) => {
  req.session.destroy((err: any) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};
