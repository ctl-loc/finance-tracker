import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { ENVIRONMENT } from "./config";

if (ENVIRONMENT !== "production") {
    dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENVIRONMENT}`) });
}
console.log(process.env.DB_HOST);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
});

export default pool;
