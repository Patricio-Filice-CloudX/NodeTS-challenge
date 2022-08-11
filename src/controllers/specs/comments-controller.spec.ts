import 'reflect-metadata';
import { CommentsController } from '../comments-controller';
import { mock, MockProxy } from 'jest-mock-extended';
import { ICommentService } from '../../services/interfaces/icomment-service';
import { Request, Response } from 'express';
import { PaginatedResult } from '../../persistence/paginated-result';
import { IComment } from '../../models/comment.model';
import { CreatedNegotiatedContentResult, OkNegotiatedContentResult } from 'inversify-express-utils/lib/results';

describe("Articles Controller", () => {
    let commentService: MockProxy<ICommentService>;
    let request: MockProxy<Request>;
    let response: MockProxy<Response>;
    let commentsController: CommentsController;

    beforeEach(() => {
        commentService = mock<ICommentService>();
        request = mock<Request>();
        response = mock<Response>();
        commentsController = new CommentsController(commentService);
    })

    it("Should list comments", async () => {
        const paginatedResult = {} as PaginatedResult<IComment>;

        commentService.list
                      .calledWith(request)
                      .mockResolvedValue(paginatedResult);
        
        const result = await commentsController.list(request, response);
        
        expect(result).toBeInstanceOf(OkNegotiatedContentResult);
        expect(result['content']).toBe(paginatedResult);

        expect(commentService.list).toBeCalledTimes(1);
        expect(commentService.list).toBeCalledWith(request);
    });

    it("Should get a comment", async () => {
        const comment = {} as IComment;

        commentService.get
                      .calledWith(request)
                      .mockResolvedValue(comment);
        
        const result = await commentsController.get(request, response);
        
        expect(result).toBeInstanceOf(OkNegotiatedContentResult)
        expect(result['content']).toBe(comment)

        expect(commentService.get).toBeCalledTimes(1);
        expect(commentService.get).toBeCalledWith(request);
    });

    it("Should create a comment", async () => {
        const commentId = "123456789";

        commentService.create
                      .calledWith(request)
                      .mockResolvedValue(commentId);
        
        const result = await commentsController.create(request, response);
        
        expect(result).toBeInstanceOf(CreatedNegotiatedContentResult)
        expect(result['content']).toEqual({ id: commentId });

        expect(commentService.create).toBeCalledTimes(1);
        expect(commentService.create).toBeCalledWith(request);
    });

    it("Should update a comment", async () => {
        commentService.update
                      .calledWith(request);
        
        response.status
                .mockReturnThis();

        await commentsController.update(request, response);

        expect(commentService.update).toBeCalledTimes(1);
        expect(commentService.update).toBeCalledWith(request);

        expect(response.status).toBeCalledTimes(1);
        expect(response.status).toBeCalledWith(204);
        expect(response.send).toBeCalledTimes(1);
    });

    it("Should delete a comment", async () => {
        commentService.delete
                      .calledWith(request);
        
        response.status
                .mockReturnThis();

        await commentsController.delete(request, response);

        expect(commentService.delete).toBeCalledTimes(1);
        expect(commentService.delete).toBeCalledWith(request);

        expect(response.status).toBeCalledTimes(1);
        expect(response.status).toBeCalledWith(204);
        expect(response.send).toBeCalledTimes(1);
    });
})