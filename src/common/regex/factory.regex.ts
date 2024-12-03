import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ProtocolRegex } from "./protocol.regex";
import { OnlyLowercaseLettersRegex } from "./only-lowercase-letters.regex";
import { RemoveSpacesRegex } from "./remove-spaces.regex";

export type ClassNames = 'OnlyLowercaseLettersRegex' | 'RemoveSpacesRegex';

@Injectable()
export class FactoryRegex {
    create(className: ClassNames): ProtocolRegex {
        switch (className){
            case 'OnlyLowercaseLettersRegex':
                return new OnlyLowercaseLettersRegex();
            case 'RemoveSpacesRegex': 
                return new RemoveSpacesRegex();
            default :
                throw new InternalServerErrorException(`No class found for ${className}`);
        }
    }
}