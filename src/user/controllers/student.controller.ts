import { 
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    HttpStatus,
    Param,
    ParseIntPipe, 
    Patch, 
    Post, 
    UploadedFile, 
    UseInterceptors
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, TokenStudentDto, UpdateStudentDto } from '../dto/student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from '../utils/multer';
import { OptionType } from '../interfaces/student.interface';


@Controller('/students')
export class StudentController {
    constructor(private studentService: StudentService) {}

    @Get()
    fetchStudents() {
        return this.studentService.fetchAll();
    }

    @Get('/:id')
    fetchOneStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.fetchOne(id);
    }

    // sign up
    @Post()
    createStudent(@Body() dto: CreateStudentDto) {
        return this.studentService.create(dto);
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
        return this.studentService.updatePhoto(id, imageFile)
    }

}