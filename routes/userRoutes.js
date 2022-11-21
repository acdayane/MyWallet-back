import express from "express";
import { signUp, signIn, signOut } from "../controllers/usersController.js";

const router = express.Router();

router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.delete("/sign-out", signOut);

export default router;