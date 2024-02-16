import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { Article } from './article.schema';

export type ReactionDocument = HydratedDocument<Reaction>;
export enum React {
    LIKE = "satisfaction",
    FUNNY = "happy",
    SAD = "sad",
    LOVE = "love",
    ANGRY = 'angry',
    SURPRISE ='surprise'
}
@Schema({
    timestamps: true
})

export class Reaction extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Article" })
    article: Article

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User

    @Prop({ required: true })
    reactionType: React
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);