import express from "express";
import { signIn, signOut, signUp } from "../controllers/userAuthController.js"
import validateRequest  from "../middleware/inputTypeValidation.js";

const router = express.Router();

router.post("/register", validateRequest("signUp"), signUp);
router.post("/login", validateRequest("signIn"), signIn);
router.post("/logout", signOut);

export default router;