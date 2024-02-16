import { Article } from "src/news/schema/article.schema"

export class updateCommentDto {
    readonly article: Article
    readonly content: string
}