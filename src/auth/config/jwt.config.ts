import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => {
    return {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        jwtTimeToLive: Number(process.env.JWT_TIME_TO_LIVE) ?? 3600,
    }
})