import { Handler, Request, RequestHandler, Response } from "express";
import { User } from "../models/user.model";
import * as userService from "../services/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SERVER } from "../config/config";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(422).json({
                mesage: "Please register with a username, passsword and an email",
            });
            return;
        }

        const potentialUser = await userService.getUserByUsername(username);
        if (potentialUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user: User = { username, email, password: hashedPassword };

        console.log("Creating user :", user);
        await userService.createUser(user);

        res.status(201).json({ message: "User created" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(422).json({
            message: "Please provide a user and a password",
        });
    }

    try {
        const user = await userService.getUserByUsername(username);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const validPassword = await userService.getUserPassword(username);
        const passwordMatch = await bcrypt.compare(
            String(password),
            String(validPassword),
        );
        if (!passwordMatch) {
            res.status(401).json({ error: "Authentication failed" });
            return;
        }

        const token = jwt.sign(
            { name: user.username, id: user._id },
            SERVER.secret,
            {
                expiresIn: "1h",
            },
        );
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};
