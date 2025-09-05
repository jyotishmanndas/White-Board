import { Router } from "express";
import { userSignIn, userSignup } from "../controllers/user.controllers";

const router: Router = Router();

router.post("/signup", userSignup);
router.post("/signin", userSignIn)


export default router;