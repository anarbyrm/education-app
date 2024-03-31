import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from './entities/tutor.entity';
import { Student } from './entities/student.entity';
import { Admin } from './entities/admin.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
        @InjectRepository(Tutor)
        private tutorRepository: Repository<Tutor>,
        @InjectRepository(Student)
        private studentRepository: Repository<Student>
    ) {}

}
