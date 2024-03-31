import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseContent } from './entities/course-content.entity';
import { ContentSection } from './entities/content-section.entity';
import { Lecture } from './entities/lecture.entity';
import { Category } from './entities/category.entity';
import { Rating } from './entities/rating.entity';
import { Review } from './entities/review.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Course,
        CourseContent,
        ContentSection,
        Lecture,
        Category,
        Rating,
        Review
    ])],
    controllers: [CourseController],
    providers: [CourseService],
    exports: [TypeOrmModule]
})
export class CourseModule {}
