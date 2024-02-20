import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());


  app.use(cors({
    origin:'https://evaluation-rust.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }))

  // Start the application
  await app.listen(3002);
}

bootstrap();
