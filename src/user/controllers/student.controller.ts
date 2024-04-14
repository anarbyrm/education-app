import { 
    Body, 
    Controller, 
    DefaultValuePipe, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus,
    Param,
    ParseBoolPipe,
    ParseIntPipe, 
    Patch, 
    Post, 
    Query, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StudentService } from '../services/student.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from '../../utils/multer';
import { OptionType } from '../interfaces/student.interface';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { IsAdminOrOwnsEntityGuard, LogInGuard } from '../guards/user.guards';
import { UserFilterQuery } from '../interfaces/user.interface';


@ApiBearerAuth()
@ApiTags('users', 'students')
@Controller('/users/students')
export class StudentController {
    constructor(private studentService: StudentService) {}

    @Get()
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    fetchStudents(
        @Query() query?: UserFilterQuery,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number    
    ) {
        return this.studentService.fetchAll(query, limit, offset);
    }

    @Get('/:id')
    @ApiParam({ name: 'id' })
    fetchOneStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.fetchOne(id);
    }

    @Post()
    @ApiTags('auth')
    createStudent(@Body() dto: CreateUserDto) {
        return this.studentService.create(dto);
    }

    @Patch('/:id')
    @ApiParam({ name: 'id' })
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    updateStudent(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.studentService.update(id, dto);
    }

    @Patch('/:id/avatar')
    @ApiParam({ name: 'id' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                }
            }
        }
    })
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    @UseInterceptors(FileInterceptor('image', createMulterOptions(OptionType.AVATAR)))
    updateStudentPhoto(
        @Param('id', ParseIntPipe) id: number,  
        @UploadedFile() imageFile: Express.Multer.File
    ) { 
        return this.studentService.updatePhoto(id, imageFile);
    }

    @Delete('/:id/avatar')
    @ApiParam({ name: 'id' })
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    removePhoto(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.removePhoto(id);
    }

    @Delete('/:id')
    @ApiParam({ name: 'id' })
    @ApiQuery({ name: 'permanent', required: false })
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    deleteStudent(
        @Param('id', ParseIntPipe) id: number,
        @Query('permanent', ParseBoolPipe) permanent?: boolean
    ) {
        return this.studentService.delete(id, permanent);
    }

    @Patch('/:id/unfreeze')
    @ApiParam({ name: 'id' })
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    unfreezeStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.unfreeze(id);
    }

    @Get('/:id/courses')
    @ApiParam({ name: 'id' })
    fetchCourses(@Param('id') id: number) {
        return this.studentService.fetchCourses(id);
    }
}
