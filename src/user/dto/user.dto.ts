import { IsDefined, IsEmail, Length } from "class-validator";

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
