import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token.payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token.payload.dto';


@Controller('/people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.peopleService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto
  ) {
    return this.peopleService.update(+id, updatePersonDto, tokenPayloadParam);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: string,
    @TokenPayloadParam() tokenPayloadParam: TokenPayloadDto
  ) {
    return this.peopleService.remove(+id, tokenPayloadParam);
  }
}
