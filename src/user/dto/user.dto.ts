import { ApiProperty } from "@nestjs/swagger";
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
    @ApiProperty()
    email: string;

    @IsDefined()
    @ApiProperty()
    password: string;
}

export class CreateUserDto {
    @IsEmail()
    @IsDefined()
    @ApiProperty()
    email: string;

    @IsDefined()
    @Length(8)
    @ApiProperty()
    password: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false
    })
    firstName?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false
    })
    lastName?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false
    })
    bio?: string;
}