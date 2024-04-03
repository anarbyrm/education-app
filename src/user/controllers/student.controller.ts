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
    UseInterceptors
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, TokenStudentDto, UpdateStudentDto } from '../dto/student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from '../utils/multer';
import { IStudentQuery, OptionType } from '../interfaces/student.interface';


@Controller('/students')
export class StudentController {
    constructor(private studentService: StudentService) {}

    @Get()
    fetchStudents(
        @Query() query?: IStudentQuery,
        @Query('limit', new ParseIntPipe({ optional: true})) limit?: number,
        @Query('offset', new ParseIntPipe({ optional: true})) offset?: number    
    ) {
        return this.studentService.fetchAll(query, limit, offset);
    }

    @Get('/:id')
    fetchOneStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.fetchOne(id);
    }

    @Post()
    createStudent(@Body() dto: CreateStudentDto) {
        return this.studentService.create(dto);
    }

    @Get('/account/activate')
    activateAccount(@Query('token') token: string) {
        return this.studentService.verifyTokenAndActivateUser(token);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/auth/token')
    async getToken(@Body() dto: TokenStudentDto) {
        const token = await this.studentService.getToken(dto);
        return { token }
    }

    @Patch('/:id')
    updateStudent(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
        return this.studentService.update(id, dto);
    }

    @Patch('/:id/avatar')
    @UseInterceptors(FileInterceptor('photo', createMulterOptions(OptionType.AVATAR)))
    async updateStudentPhoto(
        @Param('id', ParseIntPipe) id: number,  
        @UploadedFile() imageFile: Express.Multer.File
    ) { 
        return this.studentService.updatePhoto(id, imageFile);
    }

    @Delete('/:id/avatar')
    removePhoto(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.removePhoto(id);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    deleteStudent(
        @Param('id', ParseIntPipe) id: number,
        @Query('permanent', ParseBoolPipe) permanent?: boolean
    ) {
        return this.studentService.delete(id, permanent);
    }

    @Patch('/:id/unfreeze')
    unfreezeStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.unfreeze(id);
    }

}