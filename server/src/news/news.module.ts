import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { ArticleDetailSchema } from './schema/article-detail.schema';
import { ArticleSchema } from './schema/article.schema';
import { ReactionSchema } from './schema/reaction.schema';
import CommentSchema from './schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Article", schema: ArticleSchema }]),
    MongooseModule.forFeature([{ name: "ArticleDetail", schema: ArticleDetailSchema }]),
    MongooseModule.forFeature([{ name: "Reaction", schema: ReactionSchema }]),
    MongooseModule.forFeature([{ name: "Comment", schema: CommentSchema }]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule { }
