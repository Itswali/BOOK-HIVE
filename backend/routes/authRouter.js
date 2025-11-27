// routes/authRouter.js

import express from "express";

// Updated import list
import { getUser, login, logout, register, updatePassword, simpleResetPassword } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";



const router = express.Router();

router.post("/register", register);


router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);

router.put("/password/simple-reset", simpleResetPassword);

router.put("/password/update", isAuthenticated, updatePassword)


export default router;
