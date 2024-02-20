import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());


  app.enableCors({
    origin:'https://evaluation-rust.vercel.app',
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'],
    // allowedHeaders: '*',
    credentials: true,
    optionsSuccessStatus: 204,
  })

  // Start the application
  await app.listen(3002);
}

bootstrap();
