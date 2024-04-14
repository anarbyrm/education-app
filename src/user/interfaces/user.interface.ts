import { ApiProperty } from '@nestjs/swagger';
import { Admin } from "../entities/admin.entity";
import { Student } from "../entities/student.entity";
import { Tutor } from "../entities/tutor.entity";
import { User } from "../entities/user.entity";

export class UserFilterQuery {
    @ApiProperty({
        required: false
    })
    search?: string;

    @ApiProperty({
        required: false
    })
    email?: string;

    @ApiProperty({
        required: false
    })
    active?: string;

    @ApiProperty({
        required: false
    })
    frozen?: string;
}

export type UserType = User | Admin | Tutor | Student;