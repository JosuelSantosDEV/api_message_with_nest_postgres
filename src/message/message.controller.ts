import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller("/message")
export class MessageController {

    constructor(
        private readonly messageService: MessageService
    ){}

    @Get()
    getAllMessage(@Query() paginationDto: PaginationDto){

        return this.messageService.findAll(paginationDto);
    }

    @Get("/:id")
    getOneMessage(@Param("id", ParseIntPipe) id: number){
        return this.messageService.findOne(id);
    }

    @Post()
    createMessage(@Body() message: CreateMessageDto){
        return this.messageService.create(message);
    }

    @Patch("/:id")
    updateMessage(@Param("id", ParseIntPipe) id: number, @Body() message: UpdateMessageDto){
        return this.messageService.update(id, message);
    }


    @Delete("/:id")
    deleteMessage(@Param("id", ParseIntPipe) id: number){
        return this.messageService.delete(id);
    }
}