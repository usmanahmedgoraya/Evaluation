import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from './news/news.module';
import Joi from 'joi';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }),ConfigModule.forRoot({
    validationSchema: Joi.object({
      FRONTEND_URL: Joi.string(),
      // ...
    }),
  }), MongooseModule.forRoot(process.env.MONGO_URI), AuthModule, NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
