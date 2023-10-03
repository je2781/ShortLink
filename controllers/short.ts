import short from "short-uuid";
import URLMap from "../models/urlmap";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const getHomePage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render("home", {
    docTitle: "Shortlink",
    path: "/",
    hasErrorMsg: false,
    hasMessage: false,
    Msg: null,
    validationErrors: [],
  });
};

export const encode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

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
  const uuidTranslator = short();

  // Generate a new short UUID
  const shortId = uuidTranslator.new();
  let shortUrl = "";

  const longUrl = req.body.longUrl as string;

  if (longUrl.includes("https")) {
    shortUrl = "https://short.est/" + shortId;
  } else {
    shortUrl = "http://short.est/" + shortId;
  }

  //collection for storing URL mappings
  const map = new URLMap({
    short: shortUrl,
    long: longUrl,
  });

  try {
    await map.save();
  } catch (err: any) {
    if (!err.code) {
      err.code = 500;
    }
    return next(err);
  } finally {
    res
      .status(201)
      .json({ encodedUrl: shortUrl, message: "url successfully shortened" });
  }
};

// Create a route for redirecting short URLs
export const decode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const shortUrl = req.params.shortUrl;
    const map = await URLMap.findOne({ short: shortUrl });

    if (!map) {
      const error = new Error("url pairing not found!");
      return next(error);
    }
    const longUrl = map.long;
    if (longUrl) {
      res.redirect(longUrl);
    } else {
      res.status(404).json({ error: "URL not found" });
    }
  } catch (err: any) {
    if (!err.code) {
      err.code = 500;
    }
    return next(err);
  }
};
