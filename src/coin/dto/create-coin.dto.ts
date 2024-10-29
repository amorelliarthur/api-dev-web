import { IsNotEmpty, IsString } from "class-validator";

export class CreateCoinDto {
    @IsNotEmpty()
    @IsString()
    readonly code: string;
    
    @IsNotEmpty()
    @IsString()
    readonly name: string;
}