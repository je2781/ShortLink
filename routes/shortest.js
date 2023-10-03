"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const short_1 = require("../controllers/short");
const express_validator_1 = require("express-validator");
const route_protection_1 = require("../util/route_protection");
const router = express_1.default.Router();
// POST /short/encode
router.post("/encode", route_protection_1.isAuth, (0, express_validator_1.body)("longUrl").custom((value, { req }) => {
    if (!value.includes('https') && !value.includes('https')) {
        throw new Error("This is not a valid url!");
    }
    return true;
}), short_1.encode);
// GET /short/decode
router.get("/decode/:shortid", route_protection_1.isAuth, short_1.decode);
// GEt /short/statistic/:shortid
router.get("/statistic/:shortid", route_protection_1.isAuth);
// GEt /
router.get("/", route_protection_1.isAuth, short_1.getHomePage);
// GEt /
router.get("/success", route_protection_1.isAuth, short_1.getSuccess);
exports.default = router;
