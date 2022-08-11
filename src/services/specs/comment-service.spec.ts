import 'reflect-metadata';
import CommentService from '../comment-service';
import { Request } from 'express'
import { IQueryService } from '../interfaces/iquery-service';
import { ICommentRepository } from '../../persistence/interfaces/icomment-repository';
import { IArticleRepository } from '../../persistence/interfaces/iarticle-repository';
import { anyFunction, mock, MockProxy } from "jest-mock-extended";
import { KeyQuery } from '../key-query';
import { PaginationRequest } from '../../requests/paginaton-request';
import { PaginatedResult } from '../../persistence/paginated-result';
import { IComment } from '../../models/comment.model';

describe("Comment Service", () => {
    let commentService: CommentService;
    let queryServiceMock: MockProxy<IQueryService>;
    let commentRepositoryMock: MockProxy<ICommentRepository>;
    let articleRepositoryMock: MockProxy<IArticleRepository>;

    beforeEach(() => {
        queryServiceMock = mock<IQueryService>();
        commentRepositoryMock = mock<ICommentRepository>();
        articleRepositoryMock = mock<IArticleRepository>();
        commentService = new CommentService(articleRepositoryMock, commentRepositoryMock, queryServiceMock);
    })

    it("Should create a comment", async () => {        
        const bodyRequest = {
            author: "A author",
            body: "Some body"
        };

        const paramsRequest = {
            articleId: "123456789"
        };

        const request = {
            body: bodyRequest,
            params: paramsRequest as any
        } as Request;

        const commentId = "123456789"

        commentRepositoryMock.create
                         .calledWith(expect.objectContaining(bodyRequest))
                         .mockResolvedValueOnce({ id: commentId } as IComment);

        expect(await commentService.create(request)).toBe(commentId);

        expect(articleRepositoryMock.find).toBeCalledTimes(1);
        expect(articleRepositoryMock.find).toHaveBeenCalledWith(paramsRequest.articleId);
        expect(commentRepositoryMock.create).toBeCalledTimes(1);
        expect(commentRepositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({ ...bodyRequest, article: paramsRequest.articleId }));
    });

    it("Should list comments", async () => {
        const queryRequest = {
            author: "A author",
            body: "Some body"
        };

        const paramsRequest = {
            articleId: "123456789"
        };

        const request = {
            params: paramsRequest as any,
            query: queryRequest as any
        } as Request;

        const queryObject = {
            key: "value"
        };
        const paginatedRequest = {} as PaginationRequest;
        const paginatedResult = {} as PaginatedResult<IComment>;

        queryServiceMock.createQueryObject
                        .calledWith(expect.objectContaining(queryRequest), expect.arrayContaining(
                            [
                                expect.objectContaining(new KeyQuery<any>("author", queryServiceMock.addRegex)),
                                expect.objectContaining(new KeyQuery<any>("body", queryServiceMock.addRegex))
                            ]) )
                        .mockReturnValueOnce(queryObject);

        queryServiceMock.getPaginatedRequest    
                        .calledWith(request, "author" as any)
                        .mockReturnValue(paginatedRequest);

        commentRepositoryMock.list
                            .calledWith(expect.objectContaining({ ...queryObject, article: paramsRequest.articleId }), paginatedRequest, anyFunction())
                            .mockResolvedValueOnce(paginatedResult);

        expect(await commentService.list(request)).toBe(paginatedResult);

        expect(queryServiceMock.createQueryObject).toHaveBeenCalledTimes(1);
        expect(queryServiceMock.createQueryObject).toHaveBeenCalledWith(expect.objectContaining(queryRequest), expect.arrayContaining(
                                                                        [
                                                                            expect.objectContaining(new KeyQuery<any>("author", queryServiceMock.addRegex)),
                                                                            expect.objectContaining(new KeyQuery<any>("body", queryServiceMock.addRegex))
                                                                        ]));

        
        expect(queryServiceMock.getPaginatedRequest).toHaveBeenCalledTimes(1);
        expect(queryServiceMock.getPaginatedRequest).toHaveBeenCalledWith(request, "author" as any);

        expect(commentRepositoryMock.list).toHaveBeenCalledTimes(1);
        expect(commentRepositoryMock.list).toHaveBeenCalledWith(expect.objectContaining({ ...queryObject, article: paramsRequest.articleId }), paginatedRequest, anyFunction());
    });

    it("Should get a comment", async () => {
        const paramsRequest = {
            articleId: "123456789",
            commentId: "987654321"
        }

        const request = {
            params: paramsRequest as any
        } as Request;

        const comment = {
            author: "A author",
            body: "Some body",
            article: { }
        } as IComment;

        commentRepositoryMock.find
                         .calledWith(paramsRequest.commentId)
                         .mockResolvedValueOnce(comment)

        expect(await commentService.get(request)).toEqual(comment);

        expect(commentRepositoryMock.find).toBeCalledTimes(1);
        expect(commentRepositoryMock.find).toHaveBeenCalledWith(paramsRequest.commentId);
    });

    it("Should update a comment", async () => {
        const bodyRequest = {
            author: "A author",
            body: "Some body",
        };

        const paramsRequest = {
            articleId: "123456789",
            commentId: "987654321"
        }

        const request = {
            body: bodyRequest,
            params: paramsRequest as any
        } as Request;

        await commentService.update(request);

        expect(articleRepositoryMock.find).toBeCalledTimes(1);
        expect(articleRepositoryMock.find).toHaveBeenCalledWith(paramsRequest.articleId);
        expect(commentRepositoryMock.update).toBeCalledTimes(1);
        expect(commentRepositoryMock.update).toHaveBeenCalledWith(paramsRequest.commentId, expect.objectContaining({ ...bodyRequest, article: paramsRequest.articleId }));
    });

    it("Should delete a comment", async () => {
        const paramsRequest = {
            articleId: "123456789",
            commentId: "987654321"
        }

        const request = {
            params: paramsRequest as any
        } as Request;

        await commentService.delete(request);

        expect(commentRepositoryMock.delete).toBeCalledTimes(1);
        expect(commentRepositoryMock.delete).toHaveBeenCalledWith(paramsRequest.commentId);
    });
})