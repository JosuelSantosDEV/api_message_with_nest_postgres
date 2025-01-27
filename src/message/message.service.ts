import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "./entities/message.entity";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { PeopleService } from "src/people/people.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageEntity: Repository<MessageEntity>,
        private readonly peopleService: PeopleService,
        private readonly configService: ConfigService
    ){
        const databaseUserName = this.configService.get<string>('DB_USERNAME');
        console.log({databaseUserName})
    }

    async findAll(paginationDto?: PaginationDto){
        const {limit = 10, offset = 0} = paginationDto;
        const page = offset > 0 ? offset * limit : 0; 
 
        return await this.messageEntity.find({
            take: limit,
            skip: page,
            relations: ['of', 'to'],
            order: {
                id: 'DESC'
            },
            select: {
                of: {
                    id: true,
                    name: true
                },
                to: {
                    id: true,
                    name: true
                }
            }
        });
    }
    async findOne(id: number){
        const message = await this.messageEntity.findOne({
            where: {id},
            relations: ['of', 'to'],
            order: {
                id: 'DESC'
            },
            select: {
                of: {
                    id: true,
                    name: true
                },
                to: {
                    id: true,
                    name: true
                }
            }
        });
        if(message) return message;
        else throw new NotFoundException("Message not found");
        
    }

    async create(createMessageDto: CreateMessageDto){

        const {ofId, toId} = createMessageDto;

        const of = await this.peopleService.findOne(ofId);
        const to = await this.peopleService.findOne(toId);

        const message = {
            text: createMessageDto.text,
            of,
            to,
            wasRead: false
        }
        const newMessage = await this.messageEntity.create(message);
        this.messageEntity.save(newMessage);
        return {
            ...newMessage,
            of: newMessage.of.id,
            to: newMessage.to.id
        }
    }

    async update(id: number, updateMessageDto: UpdateMessageDto){

        const oldMessage = await this.findOne(id);

        if(oldMessage.wasRead == true) throw new BadRequestException("It is not possible to update a message that has already been read.");

        const newMessage = { text: updateMessageDto.text};

        const message = await this.messageEntity.preload({id, ...newMessage});
        if(!message) throw new NotFoundException("Message not found");
        return this.messageEntity.save(message);

    }

    async delete(id: number){
        const message = await this.messageEntity.findOne({where: {id}});
        if(message) {
            this.messageEntity.remove(message);
            return {
                message: "Message deleded with success"
            }
        }
        else throw new NotFoundException("Message not found");
        
    }
}