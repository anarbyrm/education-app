import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Tutor } from './entities/tutor.entity';
import { Student } from './entities/student.entity';
import { User } from './entities/user.entity';


@Module({
    imports: [TypeOrmModule.forFeature([User, Admin, Tutor, Student])],
    controllers: [StudentController],
    providers: [StudentService],
    exports: [TypeOrmModule]
})
export class UserModule {}
