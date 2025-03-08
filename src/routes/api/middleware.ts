import { Request, Response, NextFunction } from "express";
import { verifyToken, generateToken } from "@/service/security";
import { ACCESS_TOKEN_DURATION, REFRESH_TOKEN_DURATION } from "@/config";

export const apiMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies['access-token'];
    const refreshToken = req.cookies['refresh-token'];
    if (!accessToken || !refreshToken) {
        res.redirect('/auth/signout');
        return;
    }
    let payload = verifyToken(accessToken);
    if(!payload) {
        payload = verifyToken(refreshToken);
        if (!payload) {
            res.redirect('/auth/signout');
            return;
        }
        const newAccssToken = generateToken(payload, ACCESS_TOKEN_DURATION);
        const newRefreshToken = generateToken(payload, REFRESH_TOKEN_DURATION);
        res.cookie('access-token', newAccssToken, {httpOnly: true});
        res.cookie('refresh-token', newRefreshToken, {httpOnly: true});
        res.locals.payload = payload;
    }
    next();
};