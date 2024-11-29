import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePersonDto {
    
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    password: string;

}
