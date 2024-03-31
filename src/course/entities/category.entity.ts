import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Course } from './course.entity';


@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column({ length: 50 })
    slug: string;

    @OneToMany(() => Course, (course) => course.category)
    courses: Course[];
}