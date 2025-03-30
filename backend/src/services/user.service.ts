import pool from "../config/database";
import { User } from "../models/user.model";

export const getUsers = async (): Promise<User[]> => {
    const result = await pool.query("SELECT id, username, email FROM users");
    return result.rows;
};

export const getUserByUsername = async (
    username: string,
): Promise<User | null> => {
    console.log("will query: ", username);
    console.log(
        await pool.query(
            "SELECT id, username, email FROM users WHERE username = $1",
            [username],
        ),
    );
    const result = await pool.query(
        "SELECT id, username, email FROM users WHERE username = $1",
        [username],
    );
    console.log(result);
    return result.rows[0] || null;
};

export const getUserPassword = async (username: string): Promise<string> => {
    const result = await pool.query(
        "SELECT password FROM users WHERE username = $1",
        [username],
    );
    if (result.rows.length === 0) {
        throw new Error("User not found");
    }
    return result.rows[0];
};

export const createUser = async (user: User): Promise<void> => {
    await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        [user.username, user.email, user.password],
    );
};
