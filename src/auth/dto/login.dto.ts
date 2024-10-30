import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {    
    @IsNotEmpty()
    @IsEmail({}, { message: "Entre com um email válido"})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}