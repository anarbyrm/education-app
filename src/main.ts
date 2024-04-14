import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.setGlobalPrefix('/api/v1');

  // swagger doc config
  const config = new DocumentBuilder()
      .setTitle('Education app API')
      .setDescription('This is an API documentation for education app')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const swaggerDoc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, swaggerDoc);

  await app.listen(process.env.PORT);
}
bootstrap();
