import { Handler, Request, RequestHandler, Response } from "express";
import * as userService from "../services/user.service";
import * as transactionService from "../services/transaction.service";
import pool from "../config/database";
import { Transaction } from "../models/transaction.model";

export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.getTransactions(
            res.locals.user.userID,
        );
        res.status(200).json(transactions);
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};

export const registerTransaction = async (req: Request, res: Response) => {
    const transaction = req.body as Transaction;
    try {
        await transactionService.registerTransaction(
            transaction,
            res.locals.user.userID,
        );
        res.status(201).json({ message: "Transaction registered" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};
