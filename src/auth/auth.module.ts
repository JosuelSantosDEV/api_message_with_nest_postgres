import { Global, Module } from "@nestjs/common";
import { HashingService } from "./hashing/hashing.service";
import { BcryptService } from "./hashing/bcrypt.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Person } from "src/people/entities/person.entity";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./config/jwt.config";
import { JwtModule} from "@nestjs/jwt";


@Global()
@Module({
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService
        },
        AuthService
    ],
    exports: [
        HashingService,
        JwtModule,
        ConfigModule
    ],
    controllers: [
        AuthController,
        
    ],
    imports: [
        TypeOrmModule.forFeature([
            Person
        ]),
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider())
    ]
})
export class AuthModule {

}