import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseIntPipe, 
    ParseUUIDPipe, 
    Patch, 
    Post, 
    Query, 
    Req, 
    UseGuards
 } from '@nestjs/common';
import { CourseService } from './course.service';
import { ICourseQuery } from './interfaces/course.interface';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { LogInGuard } from 'src/user/guards/user.guards';
import { ExtendedRequest } from 'src/user/interfaces/request.interface';
import { IsTutorOrAdmin } from 'src/user/guards/tutor.guard';
import { Tutor } from 'src/user/entities/tutor.entity';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';


@Controller('/courses')
export class CourseController {
    constructor(private courseService: CourseService) {}

    @Get()
    fetchAll(
        @Query() query?: ICourseQuery,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('offset', new ParseIntPipe({ optional: true })) offset?: number
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
    deleteCourse(@Param('id') id: string) {
        return this.courseService.deleteCourse(id);
    }

    @Patch('/:id')
    @UseGuards(LogInGuard, IsTutorOrAdmin)
    updateCourse(
        @Param('id') id: string,
        @Body() dto: UpdateCourseDto
    ) {
        return this.courseService.updateCourse(id, dto);
    }

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
}
