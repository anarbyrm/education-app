import { unlink } from 'fs/promises';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Student } from '../entities/student.entity';
import { checkPassword, hashPassword } from '../utils/password.util';
import { IStudentQuery } from '../interfaces/student.interface'
import { createToken } from '../utils/jwt.util';
import { MailService } from '../utils/email.util';
import { CreateUserDto, UpdateUserDto, UserTokenDto } from '../dto/user.dto';


@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        private mailService: MailService
    ) {}
    
    async fetchAll(query?: IStudentQuery, limit: number = 10, offset: number = 0) {
        const { search, email, active, frozen } = query || {};

        let qb = this.studentRepository.createQueryBuilder();

        if (search) qb = qb.where('firstName LIKE :firstName', { firstName: `%${search}%` })
                            .orWhere('lastName LIKE :lastName', { lastName: `%${search}%` })
                            .orWhere('email LIKE :email', { email: `%${search}%` });

        if (email) qb = qb.andWhere('email = :email', { email });
        if (active) qb = qb.andWhere('isActive = :active', { active });
        if (frozen) qb = qb.andWhere('isFrozen = :frozen', { frozen });
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

    async createActivationToken(email: string) {
        const secret = Buffer.alloc(32);
        secret.write(process.env.SECRET || "", 'utf8');

        const vector = Buffer.alloc(16);
        vector.write(process.env.VECTOR || "", 'utf8');

        const cipher = crypto.createCipheriv('aes-256-cbc', secret, vector);
        let encrypted = cipher.update(JSON.stringify({ email }), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return encrypted;
    }

    async verifyTokenAndActivateUser(token: string) {
        const secret = Buffer.alloc(32);
        secret.write(process.env.SECRET || "", 'utf8');

        const vector = Buffer.alloc(16);
        vector.write(process.env.VECTOR || "", 'utf8');
    
        const decipher = crypto.createDecipheriv("aes-256-cbc", secret, vector);
        let decryptedToken = decipher.update(token, "hex", "utf-8");
        decryptedToken += decipher.final("utf-8");

        const { email } = JSON.parse(decryptedToken);
        const { students: [student]} = await this.fetchAll({ email });

        const updatedStudent = await this.studentRepository.findOne({ where: { id: student.id }});
        updatedStudent.isActive = true;

        return this.studentRepository.save(updatedStudent);
    }

    async create(dto: CreateUserDto) {
        const hash = await hashPassword(dto.password);
        const newStudent = this.studentRepository.create({ email: dto.email, password: hash });
        const { email } = newStudent; 

        // create activation token
        const token = await this.createActivationToken(email);
        // send mail with html template has account activation link
        const mailInfo = await this.mailService.sendActivationMail(email, token);

        // check if activation mail sent, if not so 
        // throw error to prevent user creation and 
        // display proper error message.
        const errorMessage = 'An error occured during user creation. Please retry again later';
        if ((mailInfo).rejected.length > 0) throw new InternalServerErrorException(errorMessage);

        return await newStudent.save();
    }

    async getToken(dto: UserTokenDto) {
        const { email, password } = dto; 
        // check if user with specified email exists
        const { students: [student] } = await this.fetchAll({ email });
        if (!student) throw new BadRequestException("Email or password is wrong");

        // check if password correct
        if (!await checkPassword(password, student.password))
        throw new BadRequestException("Email or password is wrong");
        
        const token = await createToken(student.id, email);
        return token;
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

    async updatePhoto(id: number, file: Express.Multer.File) {
        try {
            const student = await this.fetchOne(id);
            const oldPhoto = student.photo;
            student.photo = file.path;

            // delete old photo if exists
            if (oldPhoto) await unlink(oldPhoto);
            return this.studentRepository.save(student);
        } catch (err) {
            // delete uploaded photo after error;
            await unlink(file.path);
            throw err;
        }
    }

    async removePhoto(id: number) {
        const student = await this.fetchOne(id);
        // set null to the value then delete current photo
        const photo = student.photo;
        
        if (!photo) return this.studentRepository.save(student);

        try {
            await unlink(photo);
        } catch (err) {
            console.log((err as Error).message);
        }

        student.photo = null;
        return this.studentRepository.save(student);
    }

    delete(id: number, permanent: boolean) {
        if (!permanent) return this.studentRepository.update(id, { isFrozen: true });
        return this.studentRepository.delete(id);
    }

    unfreeze(id: number) {
        return this.studentRepository.update(id, { isFrozen: false });
    }
}