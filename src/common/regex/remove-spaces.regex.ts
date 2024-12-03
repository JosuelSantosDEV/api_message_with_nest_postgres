import { ProtocolRegex } from "./protocol.regex";

export class RemoveSpacesRegex extends ProtocolRegex {
    execute(str: string): string {
        return str.replace(/\s+/g, '');
    }
}