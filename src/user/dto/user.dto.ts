import { 
    IsDefined, 
    IsEmail, 
    IsOptional, 
    IsString, 
    Length 
} from "class-validator";

export class UserTokenDto {
    @IsEmail()
    @IsDefined()
    email: string;

    @IsDefined()
    password: string;
}

export class CreateUserDto {
    @IsEmail()
    @IsDefined()
    email: string;

    @IsDefined()
    @Length(8)
    password: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    bio?: string;
}