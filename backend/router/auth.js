import { Router } from "express";
import {
    githubCallbackHandler
} from "../handlers/auth.js";

import { checkAuth } from "../middlewares/auth.js";

var router = Router();

router.get("/gh-callback", githubCallbackHandler)

export default router;
