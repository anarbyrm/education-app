import { IsOptional, IsString } from "class-validator";


export class UpdateStudentDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    bio: string;
}
