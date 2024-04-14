import { IsEnum, IsOptional } from "class-validator";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { AdminRole } from "../interfaces/admin.interface";
import { ApiProperty } from "@nestjs/swagger";


export class CreateAdminDto extends CreateUserDto {
    @IsOptional()
    @IsEnum(AdminRole)
    @ApiProperty()
    role?: string;
}

export class UpdateAdminDto extends UpdateUserDto {
    @IsOptional()
    @IsEnum(AdminRole)
    @ApiProperty()
    role?: string;
}