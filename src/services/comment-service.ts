import { Request } from "express";
import { inject, injectable } from "inversify";
import REPOSITORY_IDENTIFIERS from "../constants/repository-identifiers";
import SERVICE_IDENTIFIERS from "../constants/service-identifiers";
import { IArticle } from "../models/article.model";
import { IComment } from "../models/comment.model";
import { IArticleRepository } from "../persistence/interfaces/iarticle-repository";
import { ICommentRepository } from "../persistence/interfaces/icomment-repository";
import { PaginatedResult } from "../persistence/paginated-result";
import { ICommentService } from "./interfaces/icomment-service";
import { IQueryService } from "./interfaces/iquery-service";
import { KeyQuery } from "./key-query";

@injectable()
export default class CommentService implements ICommentService {
    
    constructor(@inject(REPOSITORY_IDENTIFIERS.ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
                @inject(REPOSITORY_IDENTIFIERS.COMMENT_REPOSITORY) private readonly commentRepository: ICommentRepository,
                @inject(SERVICE_IDENTIFIERS.QUERY_SERVICE) private readonly queryService: IQueryService) { }
    
    create(request: Request): Promise<string> {
        return this.doIfArticleExists(request, async (r) => {
            const comment: any = {
                article: r.params.articleId,
                author: r.body.author,
                body: r.body.body
            };

            const commentRepository = await this.commentRepository.create(comment);
            return commentRepository.id;
        });
    }
    
    public list(request: Request): Promise<PaginatedResult<IComment>> {
        const queryParams = {
            author: request.query.author,
            body: request.query.body
        };

        const queryObject = this.queryService.createQueryObject(queryParams, [
            new KeyQuery("author", this.queryService.addRegex),
            new KeyQuery("body", this.queryService.addRegex)
        ]);
        return this.commentRepository.list(queryObject,
                                           this.queryService.getPaginatedRequest<IComment>(request, "author"),
                                           cr => {
                                            return {
                                                    body: cr.body,
                                                    author: cr.author,
                                                    id: cr._id
                                                } as IComment
                                            });
    }

    async get(request: Request): Promise<IComment> {
        const commentRepository = await this.commentRepository.find(request.params.commentId);
        return {
            author: commentRepository.author,
            body: commentRepository.body,
            article: {
                id: commentRepository.article.id,
                title: commentRepository.article.title,
                body: commentRepository.article.body,
                author: commentRepository.article.author
            } as IArticle
        } as IComment;
    }

    update(request: Request): Promise<void> {
        return this.doIfArticleExists(request, (r) => {
            const comment: any = {
                article: r.params.articleId,
                author: r.body.author,
                body: r.body.body
            };

            return this.commentRepository.update(r.params.commentId, comment);
        });
    }

    async delete(request: Request): Promise<void> {
        await this.commentRepository.delete(request.params.commentId);
    }

    async doIfArticleExists<T>(request: Request, action: (request: Request) => Promise<T>): Promise<T> {
        await this.articleRepository.find(request.params.articleId);
        return action(request);
    }
}