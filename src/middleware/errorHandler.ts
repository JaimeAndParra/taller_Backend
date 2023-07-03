import { Request, Response, NextFunction } from "express";

class CustomError extends Error{

    constructor(public statusCode: number, public message: string){
        super(message);
        this.name = 'CustomError'
    }
}

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError){
        res.status(err.statusCode).json({message: err.message})
    }else if(err.message.includes("Unexpected token")){
        res.status(err.statusCode).json({message: "Body has a bad structure"})
    }else{
        res.status(500).json({message: 'Internal Server Error'})
    }
}

export default errorHandlerMiddleware