import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { ContentSection } from './content-section.entity';


@Entity()
export class CourseContent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToMany(() => ContentSection, (section) => section.content)
    sections: ContentSection[];

    @OneToOne(() => Course, (course) => course.content)
    course: Course;
}