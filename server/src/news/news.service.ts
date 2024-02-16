import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schema/user.schemas';
import { ArticleDetail } from './schema/article-detail.schema';
import { Article } from './schema/article.schema';
import { React, Reaction } from './schema/reaction.schema';

@Injectable()
export class NewsService {
  constructor(
    // Specify the type for articleModel
    @InjectModel(Article.name)
    private articleModel: mongoose.Model<Article & Document>,
    // Specify the type for articleDetailModel
    @InjectModel(ArticleDetail.name)
    private articleDetailModel: mongoose.Model<ArticleDetail & Document>,
    // Specify the type for reactionModel
    @InjectModel(Reaction.name)
    private reactionModel: mongoose.Model<Reaction & Document>,
  ) { }


  async findAll(user: User, page = 1, limit = 10): Promise<{ articles: Article[], totalCount: number }> {
    if (!user) {
      throw new UnauthorizedException('Not Authorized')
    }
    const skip = (page - 1) * limit;
    const articles = await this.articleModel.find().populate('reference').populate({
      path: 'likes',
      model: 'Reaction', // Specify the model to populate likes with
    }).skip(skip).limit(limit);
    const totalCount = await this.articleModel.countDocuments(); // Total count of documents in the collection
    return { articles, totalCount };
  }

  async GetAllData(user: User, page = 1, limit = 10): Promise<ArticleDetail[]> {
    if (!user) {
      throw new UnauthorizedException('Not Authorized')
    }
    const skip = (page - 1) * limit;
    const articles = await this.articleDetailModel.find().populate('reference').populate({
      path: 'likes',
      populate: {
        path: 'user',
        model: 'User',
      },
    }).skip(skip).limit(limit);
    return articles;
  }

  // User Reaction on Article
  async userBlogReaction(id: string, reactionType: React, user: User): Promise<Reaction> {
    // console.log(user._id,reactionType);

    const reaction = await this.reactionModel.find({ article: id, user: user._id })
    console.log(reaction);

    if (reaction.length === 0) {
      const newReaction = await this.reactionModel.create({
        article: id,
        user: user._id,
        reactionType: reactionType
      })
      const article = await this.articleModel.findById(id)
      article.likes.push(newReaction._id)
      await article.save()
      return newReaction
    };
    if (reaction[0].reactionType === reactionType) {
      const deletedReaction = await this.reactionModel.findByIdAndDelete(reaction[0]._id);
      const article = await this.articleModel.findById(id)
      article.likes = article.likes.filter(id => id !== deletedReaction._id.toString());
      await article.save();
      return deletedReaction;

    }
    const updateReaction = await this.reactionModel.findByIdAndUpdate(reaction[0]._id, { reactionType: reactionType })

    return updateReaction;
  }



  async findOne(id: string, user: User): Promise<Article> {
    if (!user) {
      throw new UnauthorizedException('Not Authorized')
    }
    const article = await this.articleModel.findOne({ _id: id }).populate('reference').populate({
      path: 'likes',
      model: 'Reaction', // Specify the model to populate likes with
    }); // Populate the 'likes' array
    return article;
  }
  async updateTable1WithReferences(): Promise<void> {
    try {
      const table1Docs = await this.articleModel.find().lean(); // Convert to plain JavaScript objects
      console.log(table1Docs);
      for (const table1Doc of table1Docs) {
        console.log("New Document updated");
        // Update the 'comments' field to an empty array if it's not already an array
        if (!Array.isArray(table1Doc.comments)) {
          table1Doc.comments = [];
        }
        // Update the 'likes' field to an empty array if it's not already an array
        if (!Array.isArray(table1Doc.likes)) {
          table1Doc.likes = [];
        }
        // Save the modified document
        await this.articleDetailModel.findByIdAndUpdate(table1Doc._id, { $set: { comments: table1Doc.comments, likes: table1Doc.likes } });
        console.log("Updated data", table1Doc);
      }
      console.log('Table 1 updated with modified fields.');
    } catch (error) {
      console.error('Error updating Table 1 with modified fields:', error);
      throw new Error('An error occurred while updating Table 1 with modified fields.');
    }
  }
  async updateTable1WithReference2(): Promise<void> {
    try {
      const table1Docs = await this.articleModel.find().limit(10).lean(); // Convert to plain JavaScript objects
      const secondTableDocs = await this.articleDetailModel.find().limit(10).lean();
      console.log(table1Docs);
      // for (const table1Doc of table1Docs) {
      //   const correspondingTable2Doc = secondTableDocs.find(doc => doc?.uuid === table1Doc?.uuid);
      //   console.log("new waiting");
      //   if (correspondingTable2Doc) {
      //     console.log("New Document updated");
      //     // Dynamically add the 'reference' field to the document
      //     table1Doc.reference = correspondingTable2Doc._id;
      //     // Save the modified document
      //     await this.articleDetailModel.findByIdAndUpdate(table1Doc._id, { $set: { reference: correspondingTable2Doc._id } });
      //     console.log("updated data", table1Doc);
      //   }
      // }
      console.log('Table 1 updated with references to Table 2.');
    } catch (error) {
      console.error('Error updating Table 1 with references:', error);
      throw new Error('An error occurred while updating Table 1 with references.');
    }
  }
}
