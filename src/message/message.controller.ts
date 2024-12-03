import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseInterceptors, UsePipes } from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ParseIntIdPipe } from "src/common/pipes/parse-int-id.pipe";
import { AuthTokenInterceptor } from "src/common/interceptors/auth-token.interceptor";
import { Request } from "express";

@Controller("/message")
@UsePipes(ParseIntIdPipe)
export class MessageController {

    constructor(
        private readonly messageService: MessageService
    ){}

    @HttpCode(HttpStatus.OK)
    @Get()
    getAllMessage(@Query() paginationDto: PaginationDto, @Req() req: Request){
        console.log("Message of middleware: " + req['internal_message'].message)
        return this.messageService.findAll(paginationDto);
    }

    @Get("/:id")
    getOneMessage(@Param("id") id: number){
        return this.messageService.findOne(id);
    }

    @UseInterceptors(AuthTokenInterceptor)
    @Post()
    createMessage(@Body() message: CreateMessageDto){
        return this.messageService.create(message);
    }

    @Patch("/:id")
    updateMessage(@Param("id") id: number, @Body() message: UpdateMessageDto){
        return this.messageService.update(id, message);
    }


    @Delete("/:id")
    deleteMessage(@Param("id") id: number){
        return this.messageService.delete(id);
    }
}