import { Admin } from "../entities/admin.entity";
import { Student } from "../entities/student.entity";
import { Tutor } from "../entities/tutor.entity";
import { User } from "../entities/user.entity";

export interface IUserFilterQuery {
    search?: string;
    email?: string;
    active?: number;
    frozen?: number;
}

export type UserType = User | Admin | Tutor | Student;