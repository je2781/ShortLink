import URLMap from "../models/urlmap";
import short from "short-uuid";
import { validationResult } from "express-validator";

export const getHomePage = (req: any, res: any, next: any) => {
  res.status(200).render("home", {
    docTitle: "Shortlink",
    path: "/",
    hasErrorMsg: false,
    hasMsg: false,
    Msg: null,
    validationErrors: [],
  });
};

export const getStats = async (req: any, res: any, next: any) => {
  const shortId = req.params.shortid;
  const map = await URLMap.findOne({ shortId: shortId });

  if (!map) {
    const error = new Error("url pairing not found!");
    return next(error);
  }

  res.status(302).json({
    createdAt: map.createdAt.toLocaleDateString("en-US"),
    originalUrl: map.longUrl,
    hasEncryption: map.longUrl.includes("https") ? true : false,
  });
};

export const encode = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);

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

  // Create an instance of short-uuid
  const uuidTranslator = short();

  // Generate a new short UUID
  const shortId = uuidTranslator.new();
  //storing shortid in session object to pass onto other middleware
  req.session.shortId = shortId;

  //collection for storing URL mappings
  const map = new URLMap({
    shortId: shortId,
    longUrl: longUrl,
  });

  try {
    await map.save();
  } catch (err) {
    return next(err);
  } finally {
    req.session.save(() => {
      res.status(302).redirect("/success");
    });
  }
};

export const getSuccess = async (req: any, res: any, next: any) => {
  res.status(200).render("success", {
    docTitle: "Success",
    path: "/success",
    shortId: req.session.shortId,
  });
};

// Create a route for redirecting short URLs
export const decode = async (req: any, res: any, next: any) => {
  try {
    const shortId = req.params.shortid;
    const map = await URLMap.findOne({ shortId: shortId });

    if (!map) {
      const error = new Error("url pairing not found!");
      return next(error);
    }
    const longUrl = map.longUrl;
    if (longUrl) {
      res.status(302).redirect(longUrl);
    } else {
      res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    return next(err);
  }
};
