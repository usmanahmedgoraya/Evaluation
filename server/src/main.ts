import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // app.useBodyParser<any('json');
  // app.useBodyParser('json', { limit: '5mb' });
  // const corsOptions: CorsOptions = {
  //   origin: 'http://localhost:3000', // Replace with your frontend URL
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // };
  // app.enableCors(corsOptions);
  // app.enableCors()
  app.enableCors({
    // origin: 'http://localhost:3000',   //origin: true, => true for all origins
    origin: '*',
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'],
    // allowedHeaders: '*',
    // allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    // credentials: true,
    optionsSuccessStatus: 204,
  });
  // app.use(function (request: Request, response: Response, next: NextFunction) {
  //   response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   next();
  // });
  app.enableCors({
    origin: 'https://evaluation-rust.vercel.app',
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
  });

  // Start the application
  await app.listen(3002);
}

bootstrap();
