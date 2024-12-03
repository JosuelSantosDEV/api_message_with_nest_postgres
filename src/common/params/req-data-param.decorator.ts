import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const UrlParam = createParamDecorator(
    ( data: keyof Request, context: ExecutionContext) => {
        const contex = context.switchToHttp();
        const request: Request = contex.getRequest();
        return request[data];
    }
)