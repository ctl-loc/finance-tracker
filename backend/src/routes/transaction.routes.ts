import express from "express";
import {
    getAllTransactions,
    registerTransaction,
} from "../controllers/transaction.controller";

const router = express.Router();

router.get("/", getAllTransactions);
router.post("/", registerTransaction);

export default router;
