import { IsOptional, IsString } from "class-validator";

export class UpdateCoinDto {
    @IsOptional()
    @IsString()
    readonly code: string;
    @IsOptional()
    @IsString()
    readonly name: string;
}