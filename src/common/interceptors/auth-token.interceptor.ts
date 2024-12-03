import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if(!token || token != '12345678') throw new UnauthorizedException("Invalid token")
        
        return next.handle();
    }

}