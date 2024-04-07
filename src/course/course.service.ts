import { unlink } from 'fs/promises';
import { stat, createReadStream } from 'fs';
import { promisify } from 'util';
import slugify from 'slugify';
import { basename } from 'path';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { ICourseQuery } from './interfaces/course.interface';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Tutor } from 'src/user/entities/tutor.entity';
import { CourseContent } from './entities/course-content.entity';
import { ContentSection } from './entities/content-section.entity';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { Lecture } from './entities/lecture.entity';
import { CreateLectureDto, UpdateLectureDto } from './dto/lecture.dto';


const statPromise = promisify(stat);

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(CourseContent)
        private contentRepository: Repository<CourseContent>,
        @InjectRepository(ContentSection)
        private sectionRepository: Repository<ContentSection>,
        @InjectRepository(Lecture)
        private lectureRepository: Repository<Lecture>,
        private entityManager: EntityManager
    ) {}

    async findAll(query: Partial<ICourseQuery> = {}, limit = 25, offset = 0) {
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
        // group ratings by course id
        qb = qb.groupBy('course.id');
        if (rating) qb = qb.having('AVG(rate.value) >= :rating', { rating: Number(rating) });

        //pagination
        if (limit) qb = qb.limit(limit);
        if (offset) qb = qb.offset(offset);

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

    deleteCourse(id: string) {
        return this.courseRepository.delete(id);
    }

    async updateCourse(id: string, dto: UpdateCourseDto) {
        if (Object.keys(dto).length === 0) return this.findOne(id);
        return this.courseRepository.update(id, dto);
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

    deleteSection(sectionId: number) {
        return this.sectionRepository.delete(sectionId);
    }

    updateSection(sectionId: number, dto: UpdateSectionDto) {
        if (Object.keys(dto).length === 0) return this.sectionRepository.findOneBy({ id: sectionId });
        return this.sectionRepository.update(sectionId, dto);
    }

    async fetchCourseLectures(courseId: string) {
        const [lectures, total] = await this.lectureRepository.findAndCount({
            where: {
                section: {
                    content: {
                        course: {
                            id: courseId
                        }
                    }
                }
            },
            order: {
                order: 'ASC'
            }
        });

        return { total, lectures }
    }

    async fetchSectionLectures(sectionId: number) {
        const [lectures, total] = await this.lectureRepository.findAndCount({
            where: {
                section: {
                    id: sectionId
                }
            }
        })
        return { total, lectures };
    }

    async fetchOneLecture(lectureId: string) {
        const lecture = await this.lectureRepository.findOneBy({ id: lectureId });
        if (!lecture) throw new NotFoundException('Lecture with specified id not found.');
        return lecture;
    }

    async fetchAndStreamLecture(lectureId: string, range: string) {
        console.log(range)
        const lecture = await this.fetchOneLecture(lectureId);
        const filepath = lecture.url;
        const filename = basename(filepath);
        const fileStats = await statPromise(lecture.url);
        const filesize = fileStats.size;
        const mimetype = `video/${filepath.split('.').at(-1)}`;

        // manage ranges requested
        let [startRange, endRange] = range?.replace('bytes=', '').split('-');
        let start = parseInt(startRange);
        let end = parseInt(endRange);

        if (end >= filesize) end = filesize;

        if (isNaN(start) || isNaN(end)) {
            const errMessage = 'Range values attached request headers must be numeric string'
            throw new HttpException(errMessage, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
        }
        const bytesize = end - start + 1;

        const stream = createReadStream(filepath, { start, end });
        const streamableFile = new StreamableFile(stream, {
            disposition: `inline; filename=${filename}`,
            type: mimetype,
            length: bytesize
        });

        return { 
            stream: streamableFile,
            start,
            end,
            bytesize, 
            filesize
        }
    }

    async createLecture(sectionId: number, file: Express.Multer.File, dto: CreateLectureDto) {
        const filePath = file.path;
        const section = await this.sectionRepository.findOneBy({ id: sectionId });
        if (!section) throw new NotFoundException('Section with specified id not found.');

        try {
            const newLecture = this.lectureRepository.create(dto)
            newLecture.url = filePath;
            newLecture.section = section;
            return this.lectureRepository.save(newLecture);
        } catch (err) {
            await unlink(filePath);
            throw err;
        }
    }

    deleteLecture(lectureId: string) {
        return this.lectureRepository.delete(lectureId);
    }

    async updateLecture(lectureId: string, dto: UpdateLectureDto, file?: Express.Multer.File) {
        const lecture = await this.fetchOneLecture(lectureId);
        const oldFile = lecture.url;
        try {
            if (file) lecture.url = file.path;
            const updatedLecture = await this.lectureRepository.save(Object.assign({}, lecture, dto));
            // if update is successful delete old related file.
            if (file) await unlink(oldFile);
            return updatedLecture;
        } catch (err) {
            if (file) await unlink(file.path);
            throw err;
        }
    }
}
