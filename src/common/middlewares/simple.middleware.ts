import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class SimpleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Encerrando a cadeia de chamadas
        // return res.status(404).send({
        //     message: "Not authorized"
        // })

        req['internal_message'] = {
            message: "Middleware"
        }
        res.setHeader("MIDDLEWARE_HEADER", "I'm Middleware :)");

        //console.log("Simple middleware: Me first!!!")

        next();

        res.on('finish', () => {
            //console.log('Finish execution')
        });
    }

}