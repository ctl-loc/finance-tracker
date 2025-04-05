import pool from "../config/database";
import { Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";

export const getTransactions = async (
    user_id: number,
): Promise<Transaction[]> => {
    const result = await pool.query(
        "SELECT _id, value, description, tags, time FROM transactions WHERE user_id = $1;",
        [user_id],
    );
    return result.rows;
};

export const registerTransaction = async (
    trans: Transaction,
): Promise<void> => {
    await pool.query(
        "INSERT INTO transactions (user_id, value, description, tags, time) VALUES ($1, $2, $3, $4, $5);",
        [trans.user_id, trans.value, trans.description, trans.tags, trans.time],
    );
};
