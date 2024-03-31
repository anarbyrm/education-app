import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Course } from './course.entity';
import { IsInt, Max, Min } from 'class-validator';
import { Student } from 'src/user/entities/student.entity';


@Entity()
export class Rating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsInt()
    @Max(5)
    @Min(1)
    value: string;

    @ManyToOne(() => Course, (course) => course.ratings)
    course: Course;

    @ManyToOne(() => Student, (user) => user.ratings)
    user: Student;
}