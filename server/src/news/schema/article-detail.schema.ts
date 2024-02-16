import mongoose, { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Article } from './article.schema';

@Schema()
export class ArticleDetail extends Document {
    @Prop({ type: mongoose.Schema.Types.String })
    uuid: Article;

    @Prop()
    site_url: string;

    @Prop()
    country: string;

    @Prop()
    spam_score: number;

}

export const ArticleDetailSchema = SchemaFactory.createForClass(ArticleDetail);

