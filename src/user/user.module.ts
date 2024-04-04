import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Tutor } from './entities/tutor.entity';
import { Student } from './entities/student.entity';
import { User } from './entities/user.entity';
import { MailService } from '../utils/email.util';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UserService } from './services/user.service';
import { UserContoller } from './controllers/user.contoller';
import { TutorController } from './controllers/tutor.controller';
import { TutorService } from './services/tutor.service';


@Module({
    imports: [TypeOrmModule.forFeature([User, Admin, Tutor, Student])],
    controllers: [StudentController, AdminController, UserContoller, TutorController],
    providers: [StudentService, MailService, AdminService, UserService, TutorService],
    exports: [TypeOrmModule, UserService]
})
export class UserModule {}
