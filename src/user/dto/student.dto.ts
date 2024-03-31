import { IsDefined, IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";


export class CreateStudentDto {
    @IsEmail()
    @IsDefined()
    email: string;

    @IsDefined()
    @IsStrongPassword()
    password: string;
}

export class TokenStudentDto {
    @IsEmail()
    @IsDefined()
    email: string;

    @IsDefined()
    password: string;
}

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