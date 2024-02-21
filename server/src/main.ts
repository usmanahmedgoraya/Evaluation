import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe

  const corsOptions: CorsOptions = {
    origin: ['https://evaluation-rust.vercel.app'], // or specify your frontend URL(s) here
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // or specify the methods you need
    allowedHeaders: ['Content-Type', 'Authorization'], // or specify the headers you need
  };
  // Enable CORS with options
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  // Start the application
  await app.listen(3002);
}

bootstrap();
