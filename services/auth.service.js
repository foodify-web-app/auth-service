// services/auth.service.js
import bcrypt from "bcryptjs";
import {redis} from "common-utils";
import userModel from "../models/userModel.js";
import { createAccessToken, createToken, verifyJwt } from "../utils/jwt.js";
import { deleteTokenBySessionId, getTokensBySessionId } from "./refreshToken.service.js";

// ---- LOGIN ----
export const login = async (email, password) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const response = await createToken(user._id, user.role);
    if (!response.success) throw new Error("Token generation failed");

    return { token: response.token, userId: user._id, role: user.role };
};


// ---- REFRESH TOKEN ----
export const refreshAccessToken = async (userId, role, sessionId) => {
    let storedToken = await redis.get(`refresh:${userId}:${sessionId}`);

    if (!storedToken) {
        const response = await getTokensBySessionId(sessionId);
        if (!response) throw new Error("Invalid or expired refresh token");
        storedToken = response.token;
        await redis.set(`refresh:${userId}:${sessionId}`, storedToken, "EX", 7 * 24 * 60 * 60);

    }
    const jwt_decoded = verifyJwt(storedToken);

    if (!jwt_decoded) throw new Error("Refresh Token Expired")
    const newAccessToken = createAccessToken(userId, role, sessionId);

    return { accessToken: newAccessToken };
};

// ---- LOGOUT ----
export const logout = async (userId, sessionId) => {
    const storedToken = await redis.get(`refresh:${userId}:${sessionId}`);
    if (!storedToken) throw new Error("No active session found");
    await redis.del(`refresh:${userId}:${sessionId}`);
    await deleteTokenBySessionId(sessionId);
    return { message: "Logged out successfully" };
};

