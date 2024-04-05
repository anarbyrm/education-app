import slugify from 'slugify';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { ICourseQuery } from './interfaces/course.interface';
import { CreateCourseDto } from './dto/course.dto';
import { Tutor } from 'src/user/entities/tutor.entity';
import { CourseContent } from './entities/course-content.entity';
import { ContentSection } from './entities/content-section.entity';
import { CreateSectionDto } from './dto/section.dto';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(CourseContent)
        private contentRepository: Repository<CourseContent>,
        @InjectRepository(ContentSection)
        private sectionRepository: Repository<ContentSection>
    ) {}

    async findAll(query: ICourseQuery = {}, limit: number = 25, offset: number = 0) {
        let qb = this.courseRepository.createQueryBuilder();
        // TODO: implement further querying...
        const [courses, total] = await qb.getManyAndCount();
        return { total, count: courses.length, limit, offset, courses };
    }

    async findOne(id: string) {
        const course = await this.courseRepository.findOne({ where: { id } });
        if (!course) throw new NotFoundException('Course with specified id not found.');
        return course
    }

    async create(dto: CreateCourseDto, user: Tutor) {
        // if slug is not provided create custom slug from title of course
        const rawSlugText = `${dto.title}-${Date.now().toString()}`;
        const slug = dto.slug ? dto.slug : slugify(rawSlugText, { lower: true });
        const course = this.courseRepository.create({ ...dto, slug });
        // set instructor the current user
        course.instructor = user;
        course.content = await this.contentRepository.save({});
        return this.courseRepository.save(course);
    }

    async addSection(id: string, dto: CreateSectionDto) {
        // TODO: Add transcation
        const course = await this.courseRepository.findOne({
             where: { id },
             relations: ['content']
        });
        const content = course.content;
        const newSection = this.sectionRepository.create({
            title: dto.title,
            order: dto.order
        });
        newSection.content = content;
        return this.sectionRepository.save(newSection);
    }

    async getSections(id: string) {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: ['content.sections', 'content.sections.lectures'],
            order: {
                content: {
                    sections: {
                        order: 'ASC'
                    }
                }
            }
       });
        const sections = course.content.sections.map((section) => {
            const lectureCount = section.lectures.length;
            return { ...section, lectureCount }
        })
        return { total: sections.length, sections: sections }
    }
}
