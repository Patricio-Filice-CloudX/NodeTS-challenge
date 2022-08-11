import 'reflect-metadata';
import { ArticlesController } from '../articles-controller';
import { mock, MockProxy } from 'jest-mock-extended';
import { IArticleService } from '../../services/interfaces/iarticle-service';
import { Request, Response } from 'express';
import { PaginatedResult } from '../../persistence/paginated-result';
import { IArticle } from '../../models/article.model';
import { CreatedNegotiatedContentResult, OkNegotiatedContentResult } from 'inversify-express-utils/lib/results';

describe("Articles Controller", () => {
    let articleService: MockProxy<IArticleService>;
    let request: MockProxy<Request>;
    let response: MockProxy<Response>;
    let articlesController: ArticlesController;

    beforeEach(() => {
        articleService = mock<IArticleService>();
        request = mock<Request>();
        response = mock<Response>();
        articlesController = new ArticlesController(articleService);
    })

    it("Should list articles", async () => {
        const paginatedResult = {} as PaginatedResult<IArticle>;

        articleService.list
                      .calledWith(request)
                      .mockResolvedValue(paginatedResult);
        
        const result = await articlesController.list(request, response);
        
        expect(result).toBeInstanceOf(OkNegotiatedContentResult);
        expect(result['content']).toBe(paginatedResult);

        expect(articleService.list).toBeCalledTimes(1);
        expect(articleService.list).toBeCalledWith(request);
    });

    it("Should get an article", async () => {
        const article = {} as IArticle;

        articleService.get
                      .calledWith(request)
                      .mockResolvedValue(article);
        
        const result = await articlesController.get(request, response);
        
        expect(result).toBeInstanceOf(OkNegotiatedContentResult)
        expect(result['content']).toBe(article)

        expect(articleService.get).toBeCalledTimes(1);
        expect(articleService.get).toBeCalledWith(request);
    });

    it("Should create an article", async () => {
        const articleId = "123456789";

        articleService.create
                      .calledWith(request)
                      .mockResolvedValue(articleId);
        
        const result = await articlesController.create(request, response);
        
        expect(result).toBeInstanceOf(CreatedNegotiatedContentResult)
        expect(result['content']).toEqual({ id: articleId });

        expect(articleService.create).toBeCalledTimes(1);
        expect(articleService.create).toBeCalledWith(request);
    });

    it("Should update an article", async () => {
        articleService.update
                      .calledWith(request);
        
        response.status
                .mockReturnThis();

        await articlesController.update(request, response);

        expect(articleService.update).toBeCalledTimes(1);
        expect(articleService.update).toBeCalledWith(request);

        expect(response.status).toBeCalledTimes(1);
        expect(response.status).toBeCalledWith(204);
        expect(response.send).toBeCalledTimes(1);
    });

    it("Should delete an article", async () => {
        articleService.delete
                      .calledWith(request);
        
        response.status
                .mockReturnThis();

        await articlesController.delete(request, response);

        expect(articleService.delete).toBeCalledTimes(1);
        expect(articleService.delete).toBeCalledWith(request);

        expect(response.status).toBeCalledTimes(1);
        expect(response.status).toBeCalledWith(204);
        expect(response.send).toBeCalledTimes(1);
    });
})