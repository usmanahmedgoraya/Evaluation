import mongoose, { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ArticleDetail } from './article-detail.schema';
import { React, ReactionDocument } from './reaction.schema';
import { CommentDocument } from './comment.schema';

@Schema()
export class Article extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "ArticleDetail" })
    reference: ArticleDetail

    @Prop()
    uuid: string;

    @Prop()
    ord_in_thread: number;

    @Prop()
    author: string;

    @Prop()
    published: Date;

    @Prop()
    title: string;

    @Prop()
    text: string;

    @Prop()
    language: string;

    @Prop()
    crawled: Date;

    @Prop()
    thread_title: string;

    @Prop()
    replies_count: number;

    @Prop()
    participants_count: number;

    @Prop()
    likes: ReactionDocument[];

    @Prop()
    comments: CommentDocument[];

    @Prop()
    type: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

