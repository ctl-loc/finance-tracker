import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import transactionRoutes from "./routes/transaction.routes";

import authMiddleware from "./middlewares/auth.middleware";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

// Middlewares
app.use(cors({ origin: "localhost:4200", credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// No need to use the authMiddleware here
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Activate JWT vérification from here
app.use(authMiddleware);

app.use("/transaction", transactionRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
