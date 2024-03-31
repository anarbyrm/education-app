import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, TokenStudentDto, UpdateStudentDto } from '../dto/student.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('/students')
export class StudentController {
    constructor(private studentService: StudentService) {}

    @Get()
    fetchStudents() {
        return this.studentService.fetchStudents();
    }

    @Get('/:id')
    fetchOneStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.fetchOneStudent(id);
    }

    // sign up
    @Post()
    createStudent(@Body() dto: CreateStudentDto) {
        return this.studentService.createStudent(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/auth/token')
    async getToken(@Body() dto: TokenStudentDto) {
        const token = await this.studentService.getToken(dto);
        return { token }
    }

    @Patch('/:id')
    updateStudent(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
        // TODO: implement student fields update
        console.log(dto)
    }

    @Patch('/:id/avatar')
    @UseInterceptors(FileInterceptor('photo'))
    updateStudentPhoto(
        @Param('id', ParseIntPipe) id: number,  
        @UploadedFile() imageFile: Express.Multer.File
    ) {
        // TODO: add file validation for size and mime types

        console.log(imageFile)
    }

}