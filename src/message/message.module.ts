import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "./entities/message.entity";
import { PeopleModule } from "src/people/people.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MessageEntity
        ]),
        PeopleModule
    ],
    controllers: [
        MessageController
    ],
    providers: [MessageService]
})
export class MessageModule {

}