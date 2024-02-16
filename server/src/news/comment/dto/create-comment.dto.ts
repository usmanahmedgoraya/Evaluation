import { Article } from "src/news/schema/article.schema"

export class createCommentDto {
    readonly article: Article
    readonly content: string
}