import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { SERVER } from "../config/config";
import * as userService from "../services/user.service";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401).json({
            message: "Need JWT authentification, check /auth/login",
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, SERVER.secret) as {
            name: string;
            id: number;
        };

        res.locals.user = {
            name: decoded.name,
            id: decoded.id,
        };

        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};

export default authMiddleware;
