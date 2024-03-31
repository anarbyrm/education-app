import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ContentSection } from './content-section.entity';


@Entity()
export class Lecture {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 50 })
    title: string

    @Column()
    url: string;

    @Column()
    duration: number;
    
    @Column({ default: false })
    isPublished: boolean;
    
    @Column()
    order: number;

    @ManyToOne(() => ContentSection, (section) => section.lectures)
    section: ContentSection
}