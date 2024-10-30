import { IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { User } from "../../auth/schemas/user.schema";

export class CreateCoinDto {
    @IsNotEmpty()
    @IsString()
    readonly code: string;
    
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsEmpty({message: "Voce não pode passar user id"})
    readonly user: User;
}