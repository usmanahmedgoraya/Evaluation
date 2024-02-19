import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { blogReactionDto } from './dto/userBlogReaction';
import { NewsService } from './news.service';
import { Reaction } from './schema/reaction.schema';

@Controller('article')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Get()
  async findAll( @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.newsService.findAll(page, limit);
  }

  @Get('single/:id')
  findOne(@Param('id') id: string,) {
    return this.newsService.findOne(id);
  }

  // reaction on Article

  @Post('reaction/:id')
  @UseGuards(JwtAuthGuard)
  async userReactionBlog(@Param('id') id: string, @Body() reaction: blogReactionDto, @Req() req: any): Promise<Reaction> {
    const { type } = reaction
    const article = await this.newsService.userBlogReaction(id, type, req.user);
    return article
  }

  @Get('analytics')
  async getAnalytics() {
    return await this.newsService.getAnalytics()
  }


  @Get('analytics-stats')
  async getAnalyticsStats() {
    return await this.newsService.totalAnalyticsStats()
  }

  @Get('total-stats')
  async getTotalStats() {
    return await this.newsService.totalStats()
  }


}
