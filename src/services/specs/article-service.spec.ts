import 'reflect-metadata';
import ArticleService from '../article-service';
import { Request } from 'express'
import { IQueryService } from '../interfaces/iquery-service';
import { ICommentRepository } from '../../persistence/interfaces/icomment-repository';
import { IArticleRepository } from '../../persistence/interfaces/iarticle-repository';
import { anyFunction, mock, MockProxy } from "jest-mock-extended";
import { IArticle } from '../../models/article.model';
import { KeyQuery } from '../key-query';
import { PaginationRequest } from '../../requests/paginaton-request';
import { PaginatedResult } from '../../persistence/paginated-result';

describe("Article Service", () => {
    let articleService: ArticleService;
    let queryServiceMock: MockProxy<IQueryService>;
    let commentRepositoryMock: MockProxy<ICommentRepository>;
    let articleRepositoryMock: MockProxy<IArticleRepository>;

    beforeEach(() => {
        queryServiceMock = mock<IQueryService>();
        commentRepositoryMock = mock<ICommentRepository>();
        articleRepositoryMock = mock<IArticleRepository>();
        articleService = new ArticleService(articleRepositoryMock, commentRepositoryMock, queryServiceMock);
    })

    it("Should create an article", async () => {
        const bodyRequest = {
            title: "A title",
            author: "A author",
            body: "Some body"
        };

        const request = {
            body: bodyRequest
        } as Request;

        const articleId = "123456789"

        articleRepositoryMock.create
                         .calledWith(expect.objectContaining(bodyRequest))
                         .mockResolvedValueOnce({ id: articleId } as IArticle);

        expect(await articleService.create(request)).toBe(articleId);

        expect(articleRepositoryMock.create).toBeCalledTimes(1);
        expect(articleRepositoryMock.create).toHaveBeenCalledWith(expect.objectContaining(bodyRequest));
    });

    it("Should list articles", async () => {
        const queryRequest = {
            title: "A title",
            author: "A author",
            body: "Some body"
        };

        const request = {
            query: queryRequest as any
        } as Request;

        const queryObject = {
            key: "value"
        };

        const paginatedRequest = {} as PaginationRequest;
        const paginatedResult = {} as PaginatedResult<IArticle>;

        queryServiceMock.createQueryObject
                    .calledWith(expect.objectContaining(queryRequest), expect.arrayContaining(
                        [
                            expect.objectContaining(new KeyQuery<any>("title", queryServiceMock.addRegex)),
                            expect.objectContaining(new KeyQuery<any>("author", queryServiceMock.addRegex)),
                            expect.objectContaining(new KeyQuery<any>("body", queryServiceMock.addRegex))
                        ]) )
                    .mockReturnValueOnce(queryObject);

        queryServiceMock.getPaginatedRequest    
                    .calledWith(request, "title" as any)
                    .mockReturnValue(paginatedRequest);

        articleRepositoryMock.list
                         .calledWith(queryObject, paginatedRequest, anyFunction())
                         .mockResolvedValueOnce(paginatedResult);

        expect(await articleService.list(request)).toBe(paginatedResult);

        expect(queryServiceMock.createQueryObject).toHaveBeenCalledTimes(1);
        expect(queryServiceMock.createQueryObject).toHaveBeenCalledWith(expect.objectContaining(queryRequest), expect.arrayContaining(
                                                                        [
                                                                            expect.objectContaining(new KeyQuery<any>("title", queryServiceMock.addRegex)),
                                                                            expect.objectContaining(new KeyQuery<any>("author", queryServiceMock.addRegex)),
                                                                            expect.objectContaining(new KeyQuery<any>("body", queryServiceMock.addRegex))
                                                                        ]));

        
        expect(queryServiceMock.getPaginatedRequest).toHaveBeenCalledTimes(1);
        expect(queryServiceMock.getPaginatedRequest).toHaveBeenCalledWith(request, "title" as any);

        expect(articleRepositoryMock.list).toHaveBeenCalledTimes(1);
        expect(articleRepositoryMock.list).toHaveBeenCalledWith(queryObject, paginatedRequest, anyFunction());
    });

    it("Should get an article", async () => {
        const paramsRequest = {
            articleId: "123456789"
        }

        const request = {
            params: paramsRequest as any
        } as Request;

        const article = {
            title: "A title",
            author: "A author",
            body: "Some body"
        } as IArticle

        articleRepositoryMock.find
                         .calledWith(paramsRequest.articleId)
                         .mockResolvedValueOnce(article)

        expect(await articleService.get(request)).toEqual(article);

        expect(articleRepositoryMock.find).toBeCalledTimes(1);
        expect(articleRepositoryMock.find).toHaveBeenCalledWith(paramsRequest.articleId);
    });

    it("Should update an article", async () => {
        const bodyRequest = {
            title: "A title",
            author: "A author",
            body: "Some body"
        };

        const paramsRequest = {
            articleId: "123456789"
        }

        const request = {
            body: bodyRequest,
            params: paramsRequest as any
        } as Request;

        await articleService.update(request);

        expect(articleRepositoryMock.update).toBeCalledTimes(1);
        expect(articleRepositoryMock.update).toHaveBeenCalledWith(paramsRequest.articleId, expect.objectContaining(bodyRequest));
    });

    it("Should delete an article", async () => {
        const paramsRequest = {
            articleId: "123456789"
        }

        const request = {
            params: paramsRequest as any
        } as Request;

        await articleService.delete(request);

        expect(articleRepositoryMock.delete).toBeCalledTimes(1);
        expect(articleRepositoryMock.delete).toHaveBeenCalledWith(paramsRequest.articleId);
        expect(commentRepositoryMock.deleteMany).toBeCalledTimes(1);
        expect(commentRepositoryMock.deleteMany).toHaveBeenCalledWith(expect.objectContaining({ article: paramsRequest.articleId }));
    });
})