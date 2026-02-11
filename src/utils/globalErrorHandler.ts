import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/client";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof z.ZodError){
        return res.status(400).json({ message: err.issues })
    }
    if(err instanceof PrismaClientKnownRequestError){
        return res.status(400).json({ message: err.message })
    }
    if(err instanceof PrismaClientUnknownRequestError){
        return res.status(500).json({ message: err.message })
    }
    if(err instanceof TypeError){
        return res.status(500).send({ message: err.message })
    }
    if(err instanceof Error){
        return res.status(Number(err.cause) || 500).send({ message: err.message })
    }

    console.log(err)
    return res.status(500).json({ message: err })
}

export default globalErrorHandler