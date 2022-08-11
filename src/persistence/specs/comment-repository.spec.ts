import 'reflect-metadata';
import { CommentRepository } from '../comment-repository';
import { PaginationRequest } from '../../requests/paginaton-request';
import { IComment } from '../../models/comment.model';
import { mock, MockProxy } from 'jest-mock-extended';
import { Model, QueryWithHelpers } from 'mongoose';
import { ICommentModelWrapper } from '../interfaces/icomment-model-wrapper';
import { EntityNotFoundError } from '../../errors/entity-not-found-error';

describe("Comment Repository", () => {
    let commentRepository: CommentRepository;
    let commentModelWrapperMock: MockProxy<ICommentModelWrapper>;
    let commentModel: MockProxy<Model<IComment>>;

    beforeEach(() => {
        commentModelWrapperMock = mock<ICommentModelWrapper>();
        commentModel = mock<Model<IComment>>();

        commentModelWrapperMock.getModel
                               .mockReturnValue(commentModel);

        commentRepository = new CommentRepository(commentModelWrapperMock);
    })

    it("Should list comments", async () => {
        const query = {};
        const paginationRequest = new PaginationRequest(1, 3, "title", 1);

        const commentsPersisted = [
            { body: "some body" } as IComment
        ];
        
        const totalCount = 5;

        const hydratedCommentItems = mock<QueryWithHelpers<Array<any>, any, any, any>>()

        commentModel.count
                    .calledWith(query)
                    .mockResolvedValueOnce(totalCount);
        
        hydratedCommentItems.lean
                            .mockReturnThis();

        hydratedCommentItems.sort
                            .calledWith(expect.objectContaining(paginationRequest.getSort()))
                            .mockReturnValue(hydratedCommentItems);
                            
        hydratedCommentItems.skip
                            .calledWith(paginationRequest.getSkipped())
                            .mockReturnValue(hydratedCommentItems);
    
        hydratedCommentItems.limit
                            .calledWith(paginationRequest.pageSize)
                            .mockResolvedValueOnce(commentsPersisted);                    

        commentModel.find
                    .calledWith(query as any)
                    .mockReturnValue(hydratedCommentItems);

        const paginatedResult = await commentRepository.list(query, paginationRequest, (a) => a);

        expect(paginatedResult.totalCount).toBe(totalCount);
        expect(paginatedResult.pageCount).toBe(2);
        expect(paginatedResult.pageItems).toEqual([expect.objectContaining({ body: "some body" } as IComment)]);

        expect(commentModel.count).toHaveBeenCalledTimes(1);
        expect(commentModel.count).toHaveBeenCalledWith(query);

        expect(commentModel.find).toHaveBeenCalledTimes(1);
        expect(commentModel.find).toHaveBeenCalledWith(query);
        expect(hydratedCommentItems.lean).toHaveBeenCalledTimes(1);
        expect(hydratedCommentItems.sort).toHaveBeenCalledTimes(1);
        expect(hydratedCommentItems.sort).toHaveBeenCalledWith(expect.objectContaining(paginationRequest.getSort()));
        expect(hydratedCommentItems.skip).toHaveBeenCalledTimes(1);
        expect(hydratedCommentItems.skip).toHaveBeenCalledWith(paginationRequest.getSkipped());
        expect(hydratedCommentItems.limit).toHaveBeenCalledTimes(1);
        expect(hydratedCommentItems.limit).toHaveBeenCalledWith(paginationRequest.pageSize);
    });

    it("Should find a comment", async () => {
        let commentId = "123456789";

        const commentPersisted = {
            body: "some body" 
        } as IComment;
        
        const hydratedCommentItems = mock<QueryWithHelpers<Array<any>, any, any, any>>()

        hydratedCommentItems.populate
                            .calledWith("article")
                            .mockReturnValue(hydratedCommentItems);

        hydratedCommentItems.exec
                            .mockResolvedValueOnce(commentPersisted)

        commentModel.findById
                    .calledWith(commentId, expect.objectContaining({ _id: 0 }))
                    .mockReturnValue(hydratedCommentItems);

        expect(await commentRepository.find(commentId)).toBe(commentPersisted);

        expect(commentModel.findById).toHaveBeenCalledTimes(1);
        expect(commentModel.findById).toHaveBeenCalledWith(commentId, expect.objectContaining({ _id: 0 }))
        
        expect(hydratedCommentItems.populate).toHaveBeenCalledTimes(1);
        expect(hydratedCommentItems.populate).toHaveBeenCalledWith("article");
        expect(hydratedCommentItems.exec).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error when a comment to retrieve is not found", async () => {
        let commentId = "123456789";
        
        const hydratedCommentItems = mock<QueryWithHelpers<Array<any>, any, any, any>>()


        hydratedCommentItems.populate
                            .calledWith("article")
                            .mockReturnValue(hydratedCommentItems);

        hydratedCommentItems.exec
                            .mockResolvedValueOnce(null)

        commentModel.findById
                    .calledWith(commentId, expect.objectContaining({ _id: 0 }))
                    .mockReturnValue(hydratedCommentItems);

        await expect(commentRepository.find(commentId)).rejects
                                                       .toThrow(EntityNotFoundError);

        expect(commentModel.findById).toHaveBeenCalledTimes(1);
        expect(commentModel.findById).toHaveBeenCalledWith(commentId, expect.objectContaining({ _id: 0 }))
        
        expect(hydratedCommentItems.populate).toHaveBeenCalledTimes(1);
        expect(hydratedCommentItems.populate).toHaveBeenCalledWith("article");
        expect(hydratedCommentItems.exec).toHaveBeenCalledTimes(1);
    });

    it("Should create a comment", async () => {
        const comment = {
            body: "some body",
            author: "some author",
        } as IComment;

        (commentModel as any).create
                             .calledWith(comment)
                             .mockResolvedValueOnce(comment)

        expect(await commentRepository.create(comment)).toBe(comment);

        expect(commentModel.create).toHaveBeenCalledTimes(1);
        expect(commentModel.create).toHaveBeenCalledWith(comment)
    });

    it("Should update a comment", async () => {
        let commentId = "123456789";

        const comment = {
            body: "some body",
            author: "some author",
        } as IComment;

        commentModel.findByIdAndUpdate
                    .calledWith(commentId, comment, expect.objectContaining({ new: true }))
                    .mockResolvedValueOnce(comment);

        await commentRepository.update(commentId, comment);

        expect(commentModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(commentModel.findByIdAndUpdate).toHaveBeenCalledWith(commentId, comment, expect.objectContaining({ new: true }))
    });

    it("Should throw an error when a comment to update is not found", async () => {
        let commentId = "123456789";

        const comment = {
            body: "some body",
            author: "some author",
        } as IComment;

        commentModel.findByIdAndUpdate
                    .calledWith(commentId, comment, expect.objectContaining({ new: true }))
                    .mockResolvedValueOnce(null);

        await expect(commentRepository.update(commentId, comment)).rejects
                                                                  .toThrow(EntityNotFoundError);

        expect(commentModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(commentModel.findByIdAndUpdate).toHaveBeenCalledWith(commentId, comment, expect.objectContaining({ new: true }))
    });

    it("Should delete a comment", async () => {
        let commentId = "123456789";

        const comment = {
            body: "some body",
            author: "some author",
        } as IComment;

        commentModel.findByIdAndDelete
                    .calledWith(commentId)
                    .mockResolvedValueOnce(comment);

        await commentRepository.delete(commentId);

        expect(commentModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(commentModel.findByIdAndDelete).toHaveBeenCalledWith(commentId)
    });

    it("Should throw an error when a comment to delete is not found", async () => {
        let commentId = "123456789";

        commentModel.findByIdAndDelete
                    .calledWith(commentId)
                    .mockResolvedValueOnce(null);

        await expect(commentRepository.delete(commentId)).rejects
                                                         .toThrow(EntityNotFoundError);

        expect(commentModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(commentModel.findByIdAndDelete).toHaveBeenCalledWith(commentId)
    });

    it("Should delete many comments", async () => {
        let filterQuery = { body: "some body" };

        commentModel.deleteMany
                    .calledWith(filterQuery as any);

        await commentRepository.deleteMany(filterQuery);

        expect(commentModel.deleteMany).toHaveBeenCalledTimes(1);
        expect(commentModel.deleteMany).toHaveBeenCalledWith(filterQuery)
    })
})