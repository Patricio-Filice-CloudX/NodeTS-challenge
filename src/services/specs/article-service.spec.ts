import 'reflect-metadata';
import ArticleService from '../article-service';
import { Request } from 'express'
import { IQueryService } from '../interfaces/iquery-service';
import { ICommentRepository } from '../../persistence/interfaces/icomment-repository';
import { IArticleRepository } from '../../persistence/interfaces/iarticle-repository';
import { mock, MockProxy } from "jest-mock-extended";
import { IArticle } from '../../models/article.model';

describe("Article Service", () => {
    let articleService: ArticleService;
    let queryService: MockProxy<IQueryService>;
    let commentRepository: MockProxy<ICommentRepository>;
    let articleRepository: MockProxy<IArticleRepository>;

    beforeEach(() => {
        queryService = mock<IQueryService>();
        commentRepository = mock<ICommentRepository>();
        articleRepository = mock<IArticleRepository>();
        articleService = new ArticleService(articleRepository, commentRepository, queryService);
    })

    test("Should list articles", async () => {
        const bodyRequest = {
            title: "A title",
            author: "A author",
            body: "Some body"
        };

        const request = {
            body: bodyRequest
        } as Request;

        const articleId = "123456789"

        articleRepository.create
                         .calledWith(expect.objectContaining(bodyRequest))
                         .mockResolvedValueOnce({ id: articleId } as IArticle);

        expect(await articleService.create(request)).toBe(articleId);

        expect(articleRepository.create).toBeCalledTimes(1);
        expect(articleRepository.create).toHaveBeenCalledWith(expect.objectContaining(bodyRequest));
    });
})