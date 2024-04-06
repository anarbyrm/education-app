import slugify from 'slugify';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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
        private sectionRepository: Repository<ContentSection>,
        private entityManager: EntityManager
    ) {}

    async findAll(query: Partial<ICourseQuery> = {}, limit: number = 25, offset: number = 0) {
        const { 
            search,
            minPrice,
            maxPrice,
            rating,
            paid,
            published
        } = query;

        let qb = this.courseRepository
            .createQueryBuilder('course')
            .addSelect('AVG(rate.value)', 'average')
            .leftJoin('course.ratings', 'rate');

        // conditions based on filters
        if (search) qb = qb.where('course.title LIKE :search', { search: `%${search}%`});
        if (minPrice) qb = qb.andWhere('course.discountedPrice >= :minPrice', { minPrice: Number(minPrice) });
        if (maxPrice) qb = qb.andWhere('course.discountedPrice <= :maxPrice', { maxPrice: Number(maxPrice) });
        if (paid) qb = qb.andWhere('course.isPaid is :paid', { paid: Boolean(paid) });
        if (published) qb = qb.andWhere('course.isPublished is :published', { published: Boolean(paid) });
        // group rating by course id
        qb = qb.groupBy('course.id');
        if (rating) qb = qb.having('AVG(rate.value) >= :rating', { rating: Number(rating) });

        const courses = await qb.getRawMany();
        const total = await qb.getCount();
        return { total, count: courses.length, limit, offset, courses };
    }

    async findOne(id: string) {
        const course = await this.courseRepository.findOne({ where: { id } });
        if (!course) throw new NotFoundException('Course with specified id not found.');
        return course
    }

    async create(dto: CreateCourseDto, user: Tutor) {
        this.entityManager.transaction(async (manager) => {
            // if slug is not provided create custom slug from title of course
            const rawSlugText = `${dto.title}-${Date.now().toString()}`;
            const slug = dto.slug ? dto.slug : slugify(rawSlugText, { lower: true });
            // check if isPaid value is false then set prices to be '0'
            if (dto.isPaid === false) dto.price = 0;
            const course = manager.create(Course, { ...dto, slug });
            // set instructor the current user
            course.instructor = user;
            // create content for new course
            const content = manager.create(CourseContent, {})
            course.content = await manager.save(CourseContent, content);
            return manager.save(Course, course);
        });
    }

    addSection(id: string, dto: CreateSectionDto) {
        this.entityManager.transaction(async (manager) => {
            const course = await manager.findOne(Course, {
                 where: { id },
                 relations: ['content']
            });
            const content = course.content;
            const newSection = manager.create(ContentSection, {
                title: dto.title,
                order: dto.order
            });
            newSection.content = content;
            return manager.save(ContentSection, newSection);
        });
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
