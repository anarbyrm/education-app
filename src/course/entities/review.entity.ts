import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Course } from './course.entity';
import { Student } from 'src/user/entities/student.entity';


@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    body: string;

    @ManyToOne(() => Course, (course) => course.reviews)
    course: Course;

    @ManyToOne(() => Student, (user) => user.reviews)
    user: Student;
}