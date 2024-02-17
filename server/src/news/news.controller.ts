import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { blogReactionDto } from './dto/userBlogReaction';
import { NewsService } from './news.service';
import { Reaction } from './schema/reaction.schema';

@Controller('article')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.newsService.findAll(req.user, page, limit);
  }

  @Get('single/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.newsService.findOne(id, req.user);
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
}
