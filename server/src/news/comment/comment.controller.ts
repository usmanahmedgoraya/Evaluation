import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Comment } from '../schema/comment.schema';
import { CommentService } from './comment.service';
import { createCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class commentController {
    constructor(private commentservice: CommentService) { }

    // Get the Comments
    @Get()
    async findAllComments(@Query() query: ExpressQuery): Promise<Comment[]> {
        return await this.commentservice.findAll(query);
    }


    // Create comments only user have access
    @Post("blog/:id")
    @UseGuards(JwtAuthGuard)
    async createComment(@Param("id") id: string, @Body() createCommentDto: createCommentDto, @Req() req): Promise<Comment> {
        return await this.commentservice.createComment(id, createCommentDto, req.user)
    }

    // Controller for Update the Comment
    @Patch(':id')
    @UseGuards(new JwtAuthGuard())
    async update(@Param('id') id: string, @Body() updateCommentDto: updateCommentDto, @Req() req) {
        const comment = await this.commentservice.UpdateComment(id, updateCommentDto, req.user);
        return comment
    }


    // Controller for Delete the Comment
    // Comment can only be deleted by user or admin

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async DeleteBlog(@Param('id') id: string, @Req() req) {
        return await this.commentservice.deleteComment(id, req.user);
    }
}
