import { IsInt, IsOptional, IsString, Min} from "class-validator";

export class  SearcUserDto{
    @IsOptional()
    @IsString()
    name: string = '';

    @IsOptional()
    @IsString()
    lastName: string = '';

    @IsInt()
    @Min(1)
    page: number = 1;

    @IsInt()
    @Min(1)
    limit: number = 5;
}