import { open } from 'fs/promises';
import { normalize } from 'path';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto, TokenStudentDto, UpdateStudentDto } from '../dto/student.dto';
import { checkPassword, hashPassword } from '../utils/password.util';
import { IStudentQuery } from '../interfaces/student.interface'
import { createToken } from '../utils/jwt.util';


@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>
    ) {}
    
    fetchAll(params?: IStudentQuery) {
        const { email, active } = params || {};
        const query: IStudentQuery = {};

        if (email) query.email = email;
        if (active) query.active = active;

        return this.studentRepository.find({ where: query });
    }

    async fetchOne(id: number) {
        const student = await this.studentRepository.findOneBy({ id });
        if (!student) throw new NotFoundException("No such user exists");
        return student;
    }

    async create(dto: CreateStudentDto) {
        const hash = await hashPassword(dto.password);
        const newStudent = this.studentRepository.create({ email: dto.email, password: hash });
        return newStudent.save();
    }

    async getToken(dto: TokenStudentDto) {
        const { email, password } = dto; 
        // check if user with specified email exists
        const [student] = await this.fetchAll({ email });
        if (!student) throw new BadRequestException("Email or password is wrong");

        // check if password correct
        if (!await checkPassword(password, student.password))
        throw new BadRequestException("Email or password is wrong");
        
        const token = await createToken(student.id, email);
        return token;
    }

    async update(id: number, dto: UpdateStudentDto) {
        const { firstName, lastName, bio } = dto;
        const student = await this.fetchOne(id);
        // update fields
        student.firstName = firstName;
        student.lastName = lastName;
        student.bio = bio;

        return this.studentRepository.save(student);
    }

    async updatePhoto(id: number, file: Express.Multer.File) {
        const student = await this.fetchOne(id);
        student.photo = file.path;
        return this.studentRepository.save(student);
    }
}