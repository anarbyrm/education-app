import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { CourseContent } from './course-content.entity';
import { Lecture } from './lecture.entity';


@Entity()
export class ContentSection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @ManyToOne(() => CourseContent, (content) => content.sections)
    content: CourseContent;

    @OneToMany(() => Lecture, (lecture) => lecture.section)
    lectures: Lecture[];
}