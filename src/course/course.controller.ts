import { 
    Body, 
    Controller, 
    DefaultValuePipe, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseFilePipe, 
    ParseIntPipe, 
    ParseUUIDPipe, 
    Patch, 
    Post, 
    Query, 
    Req, 
    UploadedFile, 
    UseGuards,
    UseInterceptors
 } from '@nestjs/common';
import { CourseService } from './course.service';
import { ICourseQuery } from './interfaces/course.interface';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { LogInGuard } from 'src/user/guards/user.guards';
import { ExtendedRequest } from 'src/user/interfaces/request.interface';
import { IsTutorOrAdmin } from 'src/user/guards/tutor.guard';
import { Tutor } from 'src/user/entities/tutor.entity';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/utils/multer';
import { OptionType } from 'src/user/interfaces/student.interface';
import { CreateLectureDto, UpdateLectureDto } from './dto/lecture.dto';


@Controller('/courses')
export class CourseController {
    constructor(private courseService: CourseService) {}

    /* -----------------------------------------------
    ------------------COURSE ROUTES-------------------
    --------------------------------------------------*/
    @Get()
    fetchAll(
        @Query() query?: ICourseQuery,
        @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number
    ) {
        return this.courseService.findAll(query, limit, offset);
    }

    @Get('/:id')
    fetchOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.courseService.findOne(id);
    }

    @Post()
    @UseGuards(LogInGuard, IsTutorOrAdmin)
    createCourse(
        @Body() dto: CreateCourseDto,
        @Req() request: ExtendedRequest<Tutor>
    ) {
        return this.courseService.create(dto, request.user);
    }

    @Delete('/:id')
    @UseGuards(LogInGuard, IsTutorOrAdmin)
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteCourse(@Param('id', ParseUUIDPipe) id: string) {
        return this.courseService.deleteCourse(id);
    }

    @Patch('/:id')
    @UseGuards(LogInGuard, IsTutorOrAdmin)
    updateCourse(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateCourseDto
    ) {
        return this.courseService.updateCourse(id, dto);
    }
    /* -----------------------------------------------
    --------------COURSE SECTIONS ROUTES --------------
    --------------------------------------------------*/
    @Post('/:id/sections')
    @UseGuards(LogInGuard, IsTutorOrAdmin)
    addSection(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: CreateSectionDto
    ) {
        return this.courseService.addSection(id, dto);
    }

    @Get('/:id/sections')
    getSections(@Param('id', ParseUUIDPipe) id: string) {
        return this.courseService.getSections(id);
    }

    @Delete('/sections/:sectionId')
    @UseGuards(LogInGuard, IsTutorOrAdmin)
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteSection(
        @Param('sectionId', ParseIntPipe) sectionId: number
    ) {
        return this.courseService.deleteSection(sectionId);
    }

    @Patch('/sections/:sectionId')
    @UseGuards(LogInGuard, IsTutorOrAdmin)
    updateSection(
        @Param('sectionId', ParseIntPipe) sectionId: number,
        @Body() dto: UpdateSectionDto
    ) {
        return this.courseService.updateSection(sectionId, dto);
    }

    /* -----------------------------------------------
    -------------COURSE LECTURES ROUTES---------------
    --------------------------------------------------*/
    @Get('/:courseId/lectures')
    fetchCourseLectures(
        @Param('courseId', ParseUUIDPipe) courseId: string
    ) {
        return this.courseService.fetchCourseLectures(courseId);
    }

    @Get('/sections/:sectionId/lectures')
    fetchSectionLectures(
        @Param('sectionId', ParseIntPipe) sectionId: number
    ) {
        return this.courseService.fetchSectionLectures(sectionId);
    }

    @Get('/lectures/:lectureId')
    fetchOneLecture(
        @Param('lectureId', ParseUUIDPipe) lectureId: string
    ) {
        return this.courseService.fetchOneLecture(lectureId);
    }

    @Post('/sections/:sectionId/lectures')
    @UseInterceptors(FileInterceptor('file', createMulterOptions(OptionType.LECTURE)))
    uploadLecture(
        @Param('sectionId', ParseIntPipe) sectionId: number,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @Body() dto: CreateLectureDto
    ) {
        return this.courseService.createLecture(sectionId, file, dto);
    }

    @Delete('/lectures/:lectureId')
    deleteLecture(
        @Param('lectureId') lectureId: string
    ) {
        return this.courseService.deleteLecture(lectureId);
    }

    @Patch('/lectures/:lectureId')
    updateLecture(
        @Param('lectureId') lectureId: string,
        @UploadedFile(new ParseFilePipe({ fileIsRequired: false })) file: Express.Multer.File,
        @Body() dto: UpdateLectureDto
    ) {
        return this.courseService.updateLecture(lectureId, dto, file);
    }
}
