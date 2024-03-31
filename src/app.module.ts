import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Admin } from './user/entities/admin.entity';
import { Tutor } from './user/entities/tutor.entity';
import { Student } from './user/entities/student.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [ User, Admin, Tutor, Student ],
      synchronize: true
    }),
    UserModule,
    CourseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
