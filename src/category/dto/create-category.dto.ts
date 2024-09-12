import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string
}
