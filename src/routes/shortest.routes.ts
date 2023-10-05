import express from "express";
import {decode, encode, getHomePage, getSuccess, getStats} from "../controllers/short";
import { body } from "express-validator";
import { isAuth } from "../util/route_protection";


const router = express.Router();

// POST /short/encode
router.post(
  "/encode",
  isAuth,
  body("longUrl").custom((value: string, {req}) => {
    if(!value.includes('https') && !value.includes('https')){
        throw new Error("This is not a valid url!");
    }

    return true;
}),
  encode
);

// GET /short/decode
router.get("/decode/:shortid", isAuth, decode);

// GEt /
router.get("/", isAuth, getHomePage);

// GEt /
router.get("/success", isAuth, getSuccess);

// GEt /
router.get("/statistic/:shortid", isAuth, getStats);


export default router;
