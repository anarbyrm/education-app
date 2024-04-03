import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Tutor } from './entities/tutor.entity';
import { Student } from './entities/student.entity';
import { User } from './entities/user.entity';
import { MailService } from './utils/email.util';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';


@Module({
    imports: [TypeOrmModule.forFeature([User, Admin, Tutor, Student])],
    controllers: [StudentController, AdminController],
    providers: [StudentService, MailService, AdminService],
    exports: [TypeOrmModule]
})
export class UserModule {}
