import { IsEnum, IsOptional } from "class-validator";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { AdminRole } from "../interfaces/admin.interface";


export class CreateAdminDto extends CreateUserDto {
    @IsOptional()
    @IsEnum(AdminRole)
    role?: string;
}

export class UpdateAdminDto extends UpdateUserDto {
    @IsOptional()
    @IsEnum(AdminRole)
    role?: string;
}