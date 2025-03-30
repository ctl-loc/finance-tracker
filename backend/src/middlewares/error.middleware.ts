import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
};

export default errorMiddleware;
