import pool from "../config/database";
import { Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";

export const getTransactions = async (user: string): Promise<Transaction[]> => {
    const result = await pool.query(
        "SELECT id, value, description, tags, time FROM transactions WHERE user = $1",
        [user],
    );
    return result.rows;
};

export const registerTransaction = async (
    trans: Transaction,
    user: string,
): Promise<void> => {
    await pool.query(
        "INSERT INTO transaction (user, value, description, tags, time) VALUES ($1, $2, $3, $4, $5)",
        [user, trans.value, trans.description, trans.tags, trans.time],
    );
};
