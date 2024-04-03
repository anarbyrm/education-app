import { IsDefined, IsEmail, Min } from "class-validator";

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
    @Min(8)
    password: string;
}
