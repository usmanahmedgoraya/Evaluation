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
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowed headers
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept' ,'Authorization'],
    // headers exposed to the client
    exposedHeaders: ['Authorization'],
    credentials: true, // Enable credentials (cookies, authorization headers) cross-origin
  });

  // Start the application
  await app.listen(3002);
}

bootstrap();
