import { 
    Body, 
    Controller, 
    DefaultValuePipe, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    Query, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TutorService } from "../services/tutor.service";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { UserFilterQuery } from "../interfaces/user.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { createMulterOptions } from "../../utils/multer";
import { OptionType } from "../interfaces/student.interface";
import { IsAdminOrOwnsEntityGuard, LogInGuard } from "../guards/user.guards";


@ApiBearerAuth()
@ApiTags('users', 'tutors')
@Controller('/users/tutors')
export class TutorController {
    constructor(private tutorService: TutorService) {}

    @Get()
    @ApiQuery({ name: 'limit', type: 'number' })
    @ApiQuery({ name: 'offset', type: 'number' })
    fetchAll(
        @Query() query: UserFilterQuery,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number
    ) {
        return this.tutorService.findAll(query, limit, offset);
    }

    @Get('/:id')
    @ApiParam({ name: 'id', type: 'number' })
    fetchOne(@Param('id', ParseIntPipe) id: number) {
        return this.tutorService.findOne(id);
    }

    @Post()
    @ApiTags('auth')
    create(@Body() dto: CreateUserDto) {
        return this.tutorService.create(dto);
    }

    @Delete('/:id')
    @ApiParam({ name: 'id', type: 'number' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.tutorService.delete(id);
    }

    @Patch('/:id')
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    updateInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto
    ) {
        return this.tutorService.update(id, dto);
    }

    @Patch('/:id/avatar')
    @ApiParam({ name: 'id', type: 'number' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    @UseInterceptors(FileInterceptor('image', createMulterOptions(OptionType.AVATAR)))
    updatePhoto(
        @Query('id', ParseIntPipe) id: number,
        @UploadedFile() imageFile: Express.Multer.File
    ) {
        return this.tutorService.updatePhoto(id, imageFile);
    }

    @Delete('/:id/avatar')
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    removePhoto(@Query('id', ParseIntPipe) id: number) {
        return this.tutorService.removePhoto(id);
    }

    @Patch('/:id/unfreeze')
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    unfreezeTutor(@Param('id', ParseIntPipe) id: number) {
        return this.tutorService.unfreeze(id);
    }

    @Get('/:id/courses')
    @ApiParam({ name: 'id', type: 'number' })
    fetchAllCourses(@Param('id') id: number) {
        return this.tutorService.fetchCourses(id);
    }
}
