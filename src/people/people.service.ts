import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeopleService {

  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>
  ){}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const person = {
        name: createPersonDto?.name,
        password: createPersonDto?.password,
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

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const person = {
      name: updatePersonDto?.name,
      password: updatePersonDto?.password,
      email: updatePersonDto?.email
    }
    const updatedPerson = await this.personRepository.preload({id, ...person});
    if(!updatedPerson) throw new NotFoundException("Person not found");
    return this.personRepository.save(updatedPerson);
  }

  async remove(id: number) {
    const person = await this.personRepository.findOneBy({
      id
    });
    if(!person) throw new NotFoundException("Person not found")
    await this.personRepository.remove(person)
    return {
      message: "Person removed with success"
    }
  }
}
