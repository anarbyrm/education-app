import { 
    BadRequestException,
    Body, 
    Controller, 
    DefaultValuePipe, 
    Delete, 
    Get, 
    Headers, 
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
    Res, 
    UploadedFile, 
    UseGuards,
    UseInterceptors
 } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
import { Response } from 'express';
import { OwnsCourseGuard } from './guards/owns-course.guard';
import { HasPaidGuard } from './guards/has-paid.guard';


@ApiTags('courses')
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
    @UseGuards(LogInGuard, IsTutorOrAdmin, OwnsCourseGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteCourse(@Param('id', ParseUUIDPipe) id: string) {
        return this.courseService.deleteCourse(id);
    }

    @Patch('/:id')
    @UseGuards(LogInGuard, IsTutorOrAdmin, OwnsCourseGuard)
    updateCourse(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateCourseDto
    ) {
        return this.courseService.updateCourse(id, dto);
    }
    /* -----------------------------------------------
    --------------COURSE SECTIONS ROUTES --------------
    --------------------------------------------------*/
    @Post('/:courseId/sections')
    @UseGuards(
        LogInGuard, 
        IsTutorOrAdmin,
        OwnsCourseGuard
    )
    addSection(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Body() dto: CreateSectionDto
    ) {
        return this.courseService.addSection(courseId, dto);
    }

    @Get('/:courseId/sections')
    getSections(@Param('courseId', ParseUUIDPipe) courseId: string) {
        return this.courseService.getSections(courseId);
    }

    @Delete('/:courseId/sections/:sectionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(
        LogInGuard, 
        IsTutorOrAdmin, 
        OwnsCourseGuard
    )
    deleteSection(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Param('sectionId', ParseIntPipe) sectionId: number
    ) {
        return this.courseService.deleteSection(courseId, sectionId);
    }

    @Patch('/:courseId/sections/:sectionId')
    @UseGuards(
        LogInGuard, 
        IsTutorOrAdmin,
        OwnsCourseGuard
    )
    updateSection(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Param('sectionId', ParseIntPipe) sectionId: number,
        @Body() dto: UpdateSectionDto
    ) {
        return this.courseService.updateSection(courseId, sectionId, dto);
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

    @Get('/:courseId/sections/:sectionId/lectures')
    fetchSectionLectures(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Param('sectionId', ParseIntPipe) sectionId: number
    ) {
        return this.courseService.fetchSectionLectures(courseId, sectionId);
    }

    @Get('/:courseId/lectures/:lectureId')
    fetchOneLecture(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Param('lectureId', ParseUUIDPipe) lectureId: string
    ) {
        return this.courseService.fetchOneLecture(courseId, lectureId);
    }
    
    @Get('/:courseId/lectures/:lectureId/stream')
    @UseGuards(LogInGuard, HasPaidGuard)
    @HttpCode(HttpStatus.PARTIAL_CONTENT)
    async steamLecture(
        @Headers('range') range: string,
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Param('lectureId', ParseUUIDPipe) lectureId: string,
        @Res({ passthrough: true }) response: Response
    ) { 
        if (!range) throw new BadRequestException('No range value found in request header.');

        const {
            stream,
            start,
            end,
            filesize,
            bytesize
        } = await this.courseService.fetchAndStreamLecture(courseId, lectureId, range);

        response.set({
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${filesize}`,
            'Content-Length': bytesize
        });

        return stream;
    }

    @Post('/:courseId/sections/:sectionId/lectures')
    @UseGuards(LogInGuard, IsTutorOrAdmin, OwnsCourseGuard)
    @UseInterceptors(FileInterceptor('file', createMulterOptions(OptionType.LECTURE)))
    uploadLecture(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Param('sectionId', ParseIntPipe) sectionId: number,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @Body() dto: CreateLectureDto
    ) {
        return this.courseService.createLecture(courseId, sectionId, file, dto);
    }

    @Delete('/:courseId/lectures/:lectureId')
    @UseGuards(LogInGuard, IsTutorOrAdmin, OwnsCourseGuard)
    deleteLecture(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Param('lectureId') lectureId: string
    ) {
        return this.courseService.deleteLecture(courseId, lectureId);
    }

    @Patch('/:courseId/lectures/:lectureId')
    @UseGuards(LogInGuard, IsTutorOrAdmin, OwnsCourseGuard)
    @UseInterceptors(FileInterceptor('file', createMulterOptions(OptionType.LECTURE)))
    updateLecture(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @Param('lectureId') lectureId: string,
        @UploadedFile(new ParseFilePipe({ fileIsRequired: false })) file: Express.Multer.File,
        @Body() dto: UpdateLectureDto
    ) {
        return this.courseService.updateLecture(courseId, lectureId, dto, file);
    }
}
