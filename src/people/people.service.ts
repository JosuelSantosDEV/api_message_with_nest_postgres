import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';

@Injectable()
export class PeopleService {

  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingService
  ){}

  async create(createPersonDto: CreatePersonDto) {
    try {

      const passwordHash = await this.hashingService.hash(createPersonDto.password);

      const person = {
        name: createPersonDto?.name,
        password: passwordHash,
        email: createPersonDto?.email
      }
  
      const newPerson = await this.personRepository.create(person);
      await this.personRepository.save(newPerson);
      return newPerson;
    } catch (error) {
      if(error.code == '23505'){
        throw new ConflictException("E-mail already exists");
      }
      throw error
    }
  }

  async findAll() {
    const people = this.personRepository.find({
      order: {
        id: 'DESC',
      }
    });
    return people;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOneBy({
      id
    });
    if(!person) throw new NotFoundException("Person not found");
    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto, tokenPayload: TokenPayloadDto) {
    
    const person = {
      name: updatePersonDto?.name,
      email: updatePersonDto?.email
    }

    if(updatePersonDto?.password){
      const passwordHash = await this.hashingService.hash(updatePersonDto.password);
      person["password"] = passwordHash;
    }

    const updatedPerson = await this.personRepository.preload({id, ...person});

    if(!updatedPerson) throw new NotFoundException("Person not found");
    if(updatedPerson.id !== tokenPayload.sub ) throw new NotFoundException("You aren't unauthorized");

    return this.personRepository.save(updatedPerson);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const person = await this.personRepository.findOneBy({
      id
    });

    if(!person) throw new NotFoundException("Person not found")

    if(person.id !== tokenPayload.sub ) throw new NotFoundException("You aren't unauthorized");

    await this.personRepository.remove(person)

    return {
      message: "Person removed with success"
    }
  }
}
