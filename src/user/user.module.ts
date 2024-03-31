import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Tutor } from './entities/tutor.entity';
import { Student } from './entities/student.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Admin, Tutor, Student])],
    controllers: [UserController],
    providers: [UserService],
    exports: [TypeOrmModule]
})
export class UserModule {}
