import express from "express";
import {authMiddleware, adminMiddleware} from "common-utils"
import { loginUser, logoutUser, refreshToken } from "../controllers/auth.controller.js";

const authRouter = express.Router();


authRouter.post("/login", loginUser);
authRouter.post("/refresh-token", authMiddleware, refreshToken);
authRouter.post("/logout", authMiddleware, logoutUser);
authRouter.post("/admin/logout", adminMiddleware, logoutUser);

export default authRouter;

