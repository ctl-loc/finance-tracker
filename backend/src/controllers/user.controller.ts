import { Handler, Request, RequestHandler, Response } from "express";
import * as userService from "../services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};

export const getUser = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const user = await userService.getUserByUsername(username);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};
