import { IsInt, IsOptional, IsString, Min,  } from "class-validator";

export class RoleSearchDto{
    @IsOptional()
    @IsString()
    role: string = '';

    @IsInt()
    @Min(1)
    page: number = 1;

    @IsInt()
    @Min(1)
    limit: number = 5;
}