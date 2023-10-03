"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const short_1 = require("../controllers/short");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// POST /short/decode
router.post("/decode", short_1.decode);
// POST /short/encode
router.post("/encode", (0, express_validator_1.body)("longUrl").isURL({
    protocols: ["http", "https", "ftp"],
    require_valid_protocol: true,
}), short_1.encode);
// GEt /short/statistic/:shortid
router.get("/statistic/:shortid");
// GEt /
router.get("/", short_1.getHomePage);
exports.default = router;
