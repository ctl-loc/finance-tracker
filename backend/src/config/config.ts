import dotenv from "dotenv";

export const ENVIRONMENT = process.env.NODE_ENV; // development or production
dotenv.config({ path: `.env.${ENVIRONMENT}` });

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 5000;

export const JWT_SECRET = process.env.JWT_SECRET || "greatsecret";

export const SERVER = {
    port: SERVER_PORT,
    hostname: SERVER_HOSTNAME,
    secret: JWT_SECRET,
};
