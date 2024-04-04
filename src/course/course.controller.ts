import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { ICourseQuery } from './interfaces/course.interface';
import { CreateCourseDto } from './dto/course.dto';
import { LogInGuard } from 'src/user/guards/user.guards';
import { ExtendedRequest } from 'src/user/interfaces/request.interface';
import { IsTutorOrAdmin } from 'src/user/guards/tutor.guard';
import { Tutor } from 'src/user/entities/tutor.entity';
import { Admin } from 'src/user/entities/admin.entity';

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
    create(
        @Body() dto: CreateCourseDto,
        @Req() request: ExtendedRequest<Tutor>
    ) {
        return this.courseService.create(dto, request.user);
    }
}
