import { IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    readonly text: string;

    @IsPositive()
    readonly ofId: number;

    @IsPositive()
    readonly toId: number;
}