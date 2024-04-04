import { 
    Body, 
    Controller, 
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
import { StudentService } from '../services/student.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from '../utils/multer';
import { OptionType } from '../interfaces/student.interface';
import { CreateUserDto, UpdateUserDto, UserTokenDto } from '../dto/user.dto';
import { IsAdminGuard } from '../guards/admin.guard';
import { IsAdminOrOwnsEntityGuard, LogInGuard } from '../guards/user.guards';
import { IUserFilterQuery } from '../interfaces/user.interface';


@Controller('/users/students')
export class StudentController {
    constructor(private studentService: StudentService) {}

    @Get()
    @UseGuards(LogInGuard, IsAdminGuard)
    fetchStudents(
        @Query() query?: IUserFilterQuery,
        @Query('limit', new ParseIntPipe({ optional: true})) limit?: number,
        @Query('offset', new ParseIntPipe({ optional: true})) offset?: number    
    ) {
        return this.studentService.fetchAll(query, limit, offset);
    }

    @Get('/:id')
    @UseGuards(LogInGuard, IsAdminGuard)
    fetchOneStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.fetchOne(id);
    }

    @Post()
    createStudent(@Body() dto: CreateUserDto) {
        return this.studentService.create(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/auth/token')
    async getToken(@Body() dto: UserTokenDto) {
        const token = await this.studentService.getToken(dto);
        return { token }
    }

    @Patch('/:id')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    updateStudent(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.studentService.update(id, dto);
    }

    @Patch('/:id/avatar')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    @UseInterceptors(FileInterceptor('image', createMulterOptions(OptionType.AVATAR)))
    updateStudentPhoto(
        @Param('id', ParseIntPipe) id: number,  
        @UploadedFile() imageFile: Express.Multer.File
    ) { 
        return this.studentService.updatePhoto(id, imageFile);
    }

    @Delete('/:id/avatar')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    removePhoto(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.removePhoto(id);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    deleteStudent(
        @Param('id', ParseIntPipe) id: number,
        @Query('permanent', ParseBoolPipe) permanent?: boolean
    ) {
        return this.studentService.delete(id, permanent);
    }

    @Patch('/:id/unfreeze')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    unfreezeStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.unfreeze(id);
    }

}