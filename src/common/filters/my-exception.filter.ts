import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter} from "@nestjs/common";

@Catch(BadRequestException)
export class MyExceptionFilter<T extends BadRequestException> implements ExceptionFilter{
    catch(exception: T, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();

        const exceptionResponse = exception.getResponse();

        const error = typeof response  === 'string' ? {
            message: exceptionResponse
        } : (exceptionResponse as object)

        response.status(404).json({
            ...error,
            message: "Failed path"
            
        })
    }

}