import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Person } from "src/people/entities/person.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfigutation: ConfigType<typeof jwtConfig>,
        private readonly jwtService : JwtService
    ){
        //console.log(jwtConfigutation)
    }

    async login(loginDto: LoginDto){

        let passwordIsValid= false;
        let throwError = true;
        

        const person = await this.personRepository.findOneBy({
            email: loginDto.email
        });

        if(person){
            passwordIsValid = await this.hashingService.compare(
                loginDto.password,
                person.password
            )
        }

        if(passwordIsValid) throwError = false;
        if(throwError) throw new UnauthorizedException("Invalid user or password");

        const accessToken = await  this.jwtService.signAsync(
            {
                sub: person.id,
                email: person.email
            },
            {
                audience: this.jwtConfigutation.audience,
                issuer: this.jwtConfigutation.issuer,
                secret: this.jwtConfigutation.secret,
                expiresIn: this.jwtConfigutation.jwtTimeToLive
            }
        )


        return { accessToken};
    }

}