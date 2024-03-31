import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Course } from 'src/course/entities/course.entity';

@ChildEntity()
export class Tutor extends User {
    @OneToMany(() => Course, (course) => course.instructor)
    courses: Course[];
}