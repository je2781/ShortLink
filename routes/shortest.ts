import express from "express";
import {decode, encode, getHomePage} from "../controllers/short";
import { body } from "express-validator";

const router = express.Router();

// POST /short/decode
router.post("/decode", decode);

// POST /short/encode
router.post(
  "/encode",
  body("longUrl").isURL({
    protocols: ["http", "https", "ftp"],
    require_valid_protocol: true,
  }),
  encode
);

// GEt /short/statistic/:shortid
router.get("/statistic/:shortid");

// GEt /
router.get("/", getHomePage);

export default router;
