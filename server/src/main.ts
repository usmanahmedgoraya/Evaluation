import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Ensure CORS is allowed for localhost:3000
  app.enableCors({
    origin:'https://evaluation-rust.vercel.app',
  })

  // Start the application
  await app.listen(3002);
}

bootstrap();
