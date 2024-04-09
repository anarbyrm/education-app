import { unlink } from 'fs/promises';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { hashPassword } from '../../utils/password.util';
import { MailService } from '../../utils/email.util';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { createCipher } from '../../utils/cipher.util';
import { IUserFilterQuery } from '../interfaces/user.interface';
import { buildQuery } from '../user.helper';


@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        private mailService: MailService
    ) {}
    
    async fetchAll(query?: IUserFilterQuery, limit = 10, offset = 0) {
        let qb = this.studentRepository.createQueryBuilder();
        qb = buildQuery<Student>(qb, query);

        // pagination
        qb = qb.limit(limit).offset(offset);
        const [result, total] = await qb.getManyAndCount();
        return { total, count: result.length, limit, offset, students: result };
    }

    async fetchOne(id: number) {
        const student = await this.studentRepository.findOneBy({ id });
        if (!student) throw new NotFoundException("No such user exists");
        return student;
    }

    async create(dto: CreateUserDto) {
        const hash = await hashPassword(dto.password);
        const newStudent = this.studentRepository.create({ email: dto.email, password: hash });
        const { email } = newStudent; 

        // create activation token
        const token = createCipher({ email });
        // send mail with html template has account activation link
        const mailInfo = await this.mailService.sendActivationMail(email, token);

        // check if activation mail sent, if not so 
        // throw error to prevent user creation and 
        // display proper error message.
        const errorMessage = 'An error occured during user creation. Please retry again later';
        if ((mailInfo).rejected.length > 0) throw new InternalServerErrorException(errorMessage);

        return await newStudent.save();
    }

    async update(id: number, dto: UpdateUserDto) {
        const { firstName, lastName, bio } = dto;
        const student = await this.fetchOne(id);

        // update fields
        student.firstName = firstName;
        student.lastName = lastName;
        student.bio = bio;

        return this.studentRepository.save(student);
    }

    async updatePhoto(id: number, image: Express.Multer.File) {
        try {
            const student = await this.fetchOne(id);
            const oldPhoto = student.photo;
            student.photo = image.path;

            // delete old photo if exists
            const updatedStudent = await this.studentRepository.save(student);
            if (oldPhoto) await unlink(oldPhoto);
            return updatedStudent;
        } catch (err) {
            // delete uploaded photo after error;
            await unlink(image.path);
            throw err;
        }
    }

    async removePhoto(id: number) {
        const student = await this.fetchOne(id);
        const photo = student.photo;

        try {
            await unlink(photo);
            student.photo = null;
        } catch (err) {
            console.log((err as Error).message);
        }

        return this.studentRepository.save(student);
    }

    delete(id: number, permanent: boolean) {
        if (!permanent) return this.studentRepository.update(id, { isFrozen: true });
        return this.studentRepository.delete(id);
    }

    unfreeze(id: number) {
        return this.studentRepository.update(id, { isFrozen: false });
    }

    async fetchCourses(id: number) {
        const student = await this.studentRepository.findOne({
            where: {
                id
            },
            relations: {
                courses: true
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                bio: true,
                photo: true
            }
        });
        if (!student) throw new NotFoundException('Student with specified id not found.');
        return student;
    }
}