import { Request } from "express";
import { inject, injectable } from "inversify";
import REPOSITORY_IDENTIFIERS from "../constants/repository-identifiers";
import SERVICE_IDENTIFIERS from "../constants/service-identifiers";
import { IArticle } from "../models/article.model";
import { IArticleRepository } from "../persistence/interfaces/iarticle-repository";
import { ICommentRepository } from "../persistence/interfaces/icomment-repository";
import { PaginatedResult } from "../persistence/paginated-result";
import { IArticleService } from "./interfaces/iarticle-service";
import { IQueryService } from "./interfaces/iquery-service";
import { KeyQuery } from "./key-query";

@injectable()
export default class ArticleService implements IArticleService {
    constructor(@inject(REPOSITORY_IDENTIFIERS.ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository,
                @inject(REPOSITORY_IDENTIFIERS.COMMENT_REPOSITORY) private readonly commentRepository: ICommentRepository,
                @inject(SERVICE_IDENTIFIERS.QUERY_SERVICE) private readonly queryService: IQueryService) { }


    public async create(request: Request): Promise<string> {
        const article = {
            author: request.body.author,
            body: request.body.body,
            title: request.body.title
        } as IArticle;

        const persistedArticle = await this.articleRepository.create(article);
        return persistedArticle.id;
    }

    public list(request: Request): Promise<PaginatedResult<IArticle>> {
        const queryParams = {
            title: request.query.title,
            author: request.query.author,
            body: request.query.body
        };

        const queryObject = this.queryService.createQueryObject(queryParams, [
            new KeyQuery("title", this.queryService.addRegex),
            new KeyQuery("author", this.queryService.addRegex),
            new KeyQuery("body", this.queryService.addRegex)
        ]);

        return this.articleRepository.list(queryObject,
                                           this.queryService.getPaginatedRequest<IArticle>(request, "title"),
                                           ar => {
                                                return {
                                                    title: ar.title,
                                                    body: ar.body,
                                                    author: ar.author,
                                                    id: ar._id
                                                } as IArticle
                                            });
    }

    async get(request: Request): Promise<IArticle> {
        const articleRepository = await this.articleRepository.find(request.params.articleId);
        return {
            title: articleRepository.title,
            author: articleRepository.author,
            body: articleRepository.body
        } as IArticle;
    }

    update(request: Request): Promise<void> {
        const article = {
            title: request.body.title,
            body: request.body.body,
            author: request.body.author
        } as IArticle;
        return this.articleRepository.update(request.params.articleId, article);
    }

    async delete(request: Request): Promise<void> {
        const deleteArticlePromise = this.articleRepository.delete(request.params.articleId);
        const deleteCommentsPromise = this.commentRepository.deleteMany({ article: request.params.articleId });
        await Promise.all([deleteArticlePromise, deleteCommentsPromise]);
    }
}