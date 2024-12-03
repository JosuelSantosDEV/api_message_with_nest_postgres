import { ProtocolRegex } from "./protocol.regex";

export class OnlyLowercaseLettersRegex extends ProtocolRegex {
    execute(str: string): string {
        return str.replace(/[^a-z]/g, '');
    }
}