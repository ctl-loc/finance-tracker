import dotenv from "dotenv";
import path from "path";

export const ENVIRONMENT = process.env.NODE_ENV; // development or production
if (ENVIRONMENT !== "production") {
    dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENVIRONMENT}`) });
}
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 5000;

export const JWT_SECRET = process.env.JWT_SECRET || "greatsecret";
export const JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "greatrefreshsecret";

export const SERVER = {
    port: SERVER_PORT,
    hostname: SERVER_HOSTNAME,
    secret: JWT_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
};
