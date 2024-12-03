import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class AnotherMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        //console.log("Another middleware: Look at me here :)")
        next();
    }

}