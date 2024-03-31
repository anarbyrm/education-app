import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([])],
    controllers: [CourseController],
    providers: [CourseService],
    exports: [TypeOrmModule]
})
export class CourseModule {}
