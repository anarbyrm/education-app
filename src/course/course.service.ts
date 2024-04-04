import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { ICourseQuery } from './interfaces/course.interface';
import { CreateCourseDto } from './dto/course.dto';
import slugify from 'slugify';
import { Tutor } from 'src/user/entities/tutor.entity';
import { CourseContent } from './entities/course-content.entity';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(CourseContent)
        private contentRepository: Repository<CourseContent>
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
        const rawSlugText = `dto.title-${Date.now().toString()}`;
        const slug = dto.slug ? dto.slug : slugify(rawSlugText, { lower: true });
        const course = this.courseRepository.create({...dto, slug});
        // set instructor the current user
        course.instructor = user;
        course.content = await this.contentRepository.save({});
        return this.courseRepository.save(course);
    }
}
