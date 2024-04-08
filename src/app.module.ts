import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyTokenMiddleware } from './user/middlewares/auth.middleware';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      // entities: [ 'src/**/**/*.entity.ts'],
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    CourseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(VerifyTokenMiddleware)
              .forRoutes('*');
    }
}
