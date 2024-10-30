import { IsEmpty, IsOptional, IsString } from "class-validator";
import { User } from "../../auth/schemas/user.schema";

export class UpdateCoinDto {
    @IsOptional()
    @IsString()
    readonly code: string;

    @IsOptional()
    @IsString()
    readonly name: string;

    @IsEmpty({message: "Voce não pode passar user id"})
    readonly user: User;
}