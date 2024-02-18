import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../auth/schema/user.schemas';
import { Article } from './article.schema';

export type CommentDocument = Document & Comment;

@Schema({
    timestamps: true
})

export class Comment extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Blog" })
    article: Article;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

    @Prop({ required: true })
    content: string;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

// CommentSchema.virtual('populatedReplies', {
//     ref: 'Replies',
//     localField: '_id',
//     foreignField: 'comment',
//     justOne: false,
// });

// // CommentSchema.set('toObject', { virtuals: true });
// CommentSchema.set('toJSON', {
//     virtuals: true,
//     transform: (doc, ret) => {
//         ret._id = ret._id;
//         delete ret.id;
//         delete ret.__v;
//     },
// });

export default CommentSchema;
