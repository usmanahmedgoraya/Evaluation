import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../auth/schema/user.schemas';
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


  async findAll(page = 1, limit = 10): Promise<{ articles: Article[], totalCount: number }> {
    const skip = (page - 1) * limit;
    const articles = await this.articleModel.find().populate('reference').populate({
      path: 'likes',
      // Specify the model to populate likes with
      model: 'Reaction', 
    }).skip(skip).limit(limit);
    const totalCount = await this.articleModel.countDocuments();
     // Total count of documents in the collection
    return { articles, totalCount };
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



  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findOne({ _id: id }).populate('reference').populate({
      path: 'likes',
      model: 'Reaction',
       // Specify the model to populate likes with
    });
     // Populate the 'likes' array
    return article;
  }

  // Update collection data
  // async updateTable1WithReferences(): Promise<void> {
  //   try {
  //     const table1Docs = await this.articleModel.find().lean(); // Convert to plain JavaScript objects
  //     console.log(table1Docs);
  //     for (const table1Doc of table1Docs) {
  //       console.log("New Document updated");
  //       // Update the 'comments' field to an empty array if it's not already an array
  //       if (!Array.isArray(table1Doc.comments)) {
  //         table1Doc.comments = [];
  //       }
  //       // Update the 'likes' field to an empty array if it's not already an array
  //       if (!Array.isArray(table1Doc.likes)) {
  //         table1Doc.likes = [];
  //       }
  //       // Save the modified document
  //       await this.articleDetailModel.findByIdAndUpdate(table1Doc._id, { $set: { comments: table1Doc.comments, likes: table1Doc.likes } });
  //       console.log("Updated data", table1Doc);
  //     }
  //     console.log('Table 1 updated with modified fields.');
  //   } catch (error) {
  //     console.error('Error updating Table 1 with modified fields:', error);
  //     throw new Error('An error occurred while updating Table 1 with modified fields.');
  //   }
  // }
  
  // async updateTable1WithReference2(): Promise<void> {
  //   try {
  //     const table1Docs = await this.articleModel.find().limit(10).lean(); // Convert to plain JavaScript objects
  //     const secondTableDocs = await this.articleDetailModel.find().limit(10).lean();
  //     console.log(table1Docs);
  //     // for (const table1Doc of table1Docs) {
  //     //   const correspondingTable2Doc = secondTableDocs.find(doc => doc?.uuid === table1Doc?.uuid);
  //     //   console.log("new waiting");
  //     //   if (correspondingTable2Doc) {
  //     //     console.log("New Document updated");
  //     //     // Dynamically add the 'reference' field to the document
  //     //     table1Doc.reference = correspondingTable2Doc._id;
  //     //     // Save the modified document
  //     //     await this.articleDetailModel.findByIdAndUpdate(table1Doc._id, { $set: { reference: correspondingTable2Doc._id } });
  //     //     console.log("updated data", table1Doc);
  //     //   }
  //     // }
  //     console.log('Table 1 updated with references to Table 2.');
  //   } catch (error) {
  //     console.error('Error updating Table 1 with references:', error);
  //     throw new Error('An error occurred while updating Table 1 with references.');
  //   }
  // }



  // Get The Graph data from Database
  async getAnalytics() {
    // Define start and end dates for the data retrieval
    const startDate = new Date('2016-10-26');
    const endDate = new Date('2016-11-26');


    // Define the interval duration in days
    const intervalDays = 4;

    // Create an empty array to store interval dates
    const intervals = [];

    // Create intervals of dates with the specified duration
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + intervalDays)) {
      intervals.push(new Date(currentDate));
    }

    // Define MongoDB aggregation pipelines for each interval
    const pipelines = intervals.map((intervalStartDate, index) => {
      // Calculate the end date of the current interval
      const intervalEndDate = new Date(intervalStartDate);
      intervalEndDate.setDate(intervalEndDate.getDate() + intervalDays);

      // Define a $match stage to filter documents within the current interval
      return {
        $match: {
          language: { $in: ['english', 'spanish'] },
          published: { $gte: intervalStartDate, $lt: intervalEndDate }
        }
      };
    });

    // Execute MongoDB aggregation for each pipeline asynchronously and collect results
    const results = await Promise.all(
      pipelines.map(async (pipeline) => {
        // Perform aggregation query using the provided pipeline
        const result = await this.articleModel.aggregate([
          pipeline,
          // Group documents by language and calculate count for each group
          { $group: { _id: '$language', count: { $sum: 1 } } }
        ]);
        // Return the aggregation result for the current interval
        return result;
      })
    );

    console.log(results);

    // Extract dates from intervals array and format them as ISO strings
    const dates = intervals.map(interval => interval.toISOString());

    // Extract English and Spanish counts from aggregation results
    const englishCounts = results.map(result => result.find(item => item._id === 'english')?.count || 0);
    const spanishCounts = results.map(result => result.find(item => item._id === 'spanish')?.count || 0);

    // Return dates, English counts, and Spanish counts
    return { dates, englishCounts, spanishCounts };
  }


  async totalStats() {
    const countryData = await this.articleModel.aggregate([
      {
        $lookup: {
          from: "articledetails",
          localField: "reference",
          foreignField: "_id",
          as: "articleDetails"
        }
      },
      {
        $unwind: "$articleDetails"
      },
      {
        $group: {
          _id: "$articleDetails.country",
          count: { $sum: 1 }
        }
      }
    ]);

    const siteUrlData = await this.articleModel.aggregate([
      {
        $lookup: {
          from: "articledetails",
          localField: "reference",
          foreignField: "_id",
          as: "articleDetails"
        }
      },
      {
        $unwind: "$articleDetails"
      },
      {
        $group: {
          _id: "$articleDetails.site_url",
          count: { $sum: 1 }
        }
      }
    ]);

    const languageData = await this.articleModel.aggregate([
      {
        $group: {
          _id: "$language",
          count: { $sum: 1 }
        }
      }
    ]);

    return { countryData, siteUrlData, languageData };
  }

  async totalAnalyticsStats() {
    const startDate = new Date('2016-10-26');
    const endDate = new Date('2016-11-26');// Adjust start date to one month ago

    // Define the interval duration in days
    const intervalDays = 4;

    // Create an empty array to store interval dates
    const intervals = [];

    // Create intervals of dates with the specified duration
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + intervalDays)) {
      intervals.push(new Date(currentDate));
    }

    // Define MongoDB aggregation pipelines for each interval
    const countryPipelines = intervals.map((intervalStartDate, index) => {
      // Calculate the end date of the current interval
      const intervalEndDate = new Date(intervalStartDate);
      intervalEndDate.setDate(intervalEndDate.getDate() + intervalDays);

      // Define a $match stage to filter documents within the current interval
      return {
        $match: {
          crawled: { $gte: intervalStartDate, $lt: intervalEndDate }
        }
      };
    });

    const siteUrlPipelines = intervals.map((intervalStartDate, index) => {
      // Calculate the end date of the current interval
      const intervalEndDate = new Date(intervalStartDate);
      intervalEndDate.setDate(intervalEndDate.getDate() + intervalDays);

      // Define a $match stage to filter documents within the current interval
      return {
        $match: {
          crawled: { $gte: intervalStartDate, $lt: intervalEndDate }
        }
      };
    });

    const languagePipelines = intervals.map((intervalStartDate, index) => {
      // Calculate the end date of the current interval
      const intervalEndDate = new Date(intervalStartDate);
      intervalEndDate.setDate(intervalEndDate.getDate() + intervalDays);

      // Define a $match stage to filter documents within the current interval
      return {
        $match: {
          crawled: { $gte: intervalStartDate, $lt: intervalEndDate }
        }
      };
    });

    // Execute MongoDB aggregation for each pipeline asynchronously and collect results
    const [countryData, siteUrlData, languageData] = await Promise.all([
      Promise.all(countryPipelines.map(pipeline => this.articleModel.aggregate([
        pipeline,
        {
          $lookup: {
            from: "articledetails",
            localField: "reference",
            foreignField: "_id",
            as: "articleDetails"
          }
        },
        {
          $unwind: "$articleDetails"
        },
        {
          $group: {
            _id: "$articleDetails.country",
            count: { $sum: 1 }
          }
        }
      ]))),
      Promise.all(siteUrlPipelines.map(pipeline => this.articleModel.aggregate([
        pipeline,
        {
          $lookup: {
            from: "articledetails",
            localField: "reference",
            foreignField: "_id",
            as: "articleDetails"
          }
        },
        {
          $unwind: "$articleDetails"
        },
        {
          $group: {
            _id: "$articleDetails.site_url",
            count: { $sum: 1 }
          }
        }
      ]))),
      Promise.all(languagePipelines.map(pipeline => this.articleModel.aggregate([
        pipeline,
        {
          $group: {
            _id: "$language",
            count: { $sum: 1 }
          }
        }
      ])))
    ]);

    languageData.forEach(e => {
      console.log(
        e.find(item => item._id === 'english')?.count || 0
      );


    })


    const languageCounts = [{
      english: [],
      french: [],
      spanish: [],
      turkish: []
    }]
    languageData.map(e => {
      languageCounts[0].english.push(e.find(item => item._id === 'english')?.count || 0)
      languageCounts[0].french.push(e.find(item => item._id === 'french')?.count || 0)
      languageCounts[0].spanish.push(e.find(item => item._id === 'spanish')?.count || 0)
      languageCounts[0].turkish.push(e.find(item => item._id === 'turkish')?.count || 0)
    })

    // country
    const countryCounts = [{
      BG: [],
      US: [],
      GB: [],
      LI: []
    }]
    countryData.map(e => {
      countryCounts[0].LI.push(e.find(item => item._id === 'LI')?.count || 0)
      countryCounts[0].BG.push(e.find(item => item._id === 'BG')?.count || 0)
      countryCounts[0].US.push(e.find(item => item._id === 'US')?.count || 0)
      countryCounts[0].GB.push(e.find(item => item._id === 'GB')?.count || 0)
    })

    // Url site count
    const urlSiteCounts = [{
      "topinfopost.com": [],
      "truthdig.com": [],
      "wnd.com": [],
      "truth-out.org": []
    }]
    siteUrlData.map(e => {
      urlSiteCounts[0]['topinfopost.com'].push(e.find(item => item._id === 'topinfopost.com')?.count || 0)
      urlSiteCounts[0]['truth-out.org'].push(e.find(item => item._id === 'truth-out.org')?.count || 0)
      urlSiteCounts[0]['truthdig.com'].push(e.find(item => item._id === 'truthdig.com')?.count || 0)
      urlSiteCounts[0]['wnd.com'].push(e.find(item => item._id === 'wnd.com')?.count || 0)
    })

    // Extract dates from intervals array and format them as ISO strings
    const dates = intervals.map(interval => interval.toISOString());

    return { dates,languageCounts, countryCounts,urlSiteCounts};
  }
}