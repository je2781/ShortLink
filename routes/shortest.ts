const express = require("express");
const router = express.Router();
const ShortController = require("../controllers/short");
const { body } = require("express-validator");

// POST /short/decode
router.post("/decode", ShortController.decode);

// POST /short/encode
router.post(
  "/encode",
  body("longUrl").isURL({
    protocols: ["http", "https", "ftp"],
    require_valid_protocol: true,
  }),
  ShortController.encode
);

// GEt /short/statistic/:shortid
router.get("/statistic/:shortid");

// GEt /
router.get("/", ShortController.getHomePage);

module.exports = router;
