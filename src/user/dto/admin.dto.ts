import { IsEnum, IsOptional } from "class-validator";
import { CreateUserDto } from "./user.dto";
import { AdminRole } from "../interfaces/admin.interface";


export class CreateAdminDto extends CreateUserDto {
    @IsOptional()
    @IsEnum(AdminRole)
    role?: string;
}