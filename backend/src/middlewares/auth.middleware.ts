import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { SERVER } from "../config/config";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401).json({
            message: "Need JWT authentification, check /auth/login",
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, SERVER.secret) as { userID: string };
        res.locals.user = decoded; // store the user in res.locals.user
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};

export default authMiddleware;
