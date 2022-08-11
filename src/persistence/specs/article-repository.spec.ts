import 'reflect-metadata';
import { ArticleRepository } from '../article-repository';
import { PaginationRequest } from '../../requests/paginaton-request';
import { IArticle } from '../../models/article.model';
import { mock, MockProxy } from 'jest-mock-extended';
import { Model, QueryWithHelpers } from 'mongoose';
import { IArticleModelWrapper } from '../interfaces/iarticle-model-wrapper';
import { EntityNotFoundError } from '../../errors/entity-not-found-error';

describe("Article Repository", () => {
    let articleRepository: ArticleRepository;
    let articleModelWrapperMock: MockProxy<IArticleModelWrapper>;
    let articleModel: MockProxy<Model<IArticle>>;

    beforeEach(() => {
        articleModelWrapperMock = mock<IArticleModelWrapper>();
        articleModel = mock<Model<IArticle>>();

        articleModelWrapperMock.getModel
                               .mockReturnValue(articleModel);

        articleRepository = new ArticleRepository(articleModelWrapperMock);
    })

    it("Should list articles", async () => {
        const query = {};
        const paginationRequest = new PaginationRequest(1, 3, "title", 1);

        const articlesPersisted = [
            { title: "some title" } as IArticle
        ];
        
        const totalCount = 5;

        const hydratedArticleItems = mock<QueryWithHelpers<Array<any>, any, any, any>>()

        articleModel.count
                    .calledWith(query)
                    .mockResolvedValueOnce(totalCount);
        
        hydratedArticleItems.lean
                            .mockReturnThis();

        hydratedArticleItems.sort
                            .calledWith(expect.objectContaining(paginationRequest.getSort()))
                            .mockReturnValue(hydratedArticleItems);
                            
        hydratedArticleItems.skip
                            .calledWith(paginationRequest.getSkipped())
                            .mockReturnValue(hydratedArticleItems);
    
        hydratedArticleItems.limit
                            .calledWith(paginationRequest.pageSize)
                            .mockResolvedValueOnce(articlesPersisted);                    

        articleModel.find
                    .calledWith(query as any)
                    .mockReturnValue(hydratedArticleItems);

        const paginatedResult = await articleRepository.list(query, paginationRequest, (a) => a);

        expect(paginatedResult.totalCount).toBe(totalCount);
        expect(paginatedResult.pageCount).toBe(2);
        expect(paginatedResult.pageItems).toEqual([expect.objectContaining({ title: "some title" } as IArticle)]);

        expect(articleModel.count).toHaveBeenCalledTimes(1);
        expect(articleModel.count).toHaveBeenCalledWith(query);

        expect(articleModel.find).toHaveBeenCalledTimes(1);
        expect(articleModel.find).toHaveBeenCalledWith(query);
        expect(hydratedArticleItems.lean).toHaveBeenCalledTimes(1);
        expect(hydratedArticleItems.sort).toHaveBeenCalledTimes(1);
        expect(hydratedArticleItems.sort).toHaveBeenCalledWith(expect.objectContaining(paginationRequest.getSort()));
        expect(hydratedArticleItems.skip).toHaveBeenCalledTimes(1);
        expect(hydratedArticleItems.skip).toHaveBeenCalledWith(paginationRequest.getSkipped());
        expect(hydratedArticleItems.limit).toHaveBeenCalledTimes(1);
        expect(hydratedArticleItems.limit).toHaveBeenCalledWith(paginationRequest.pageSize);
    });

    it("Should find an article", async () => {
        let articleId = "123456789";

        const articlePersisted = {
            title: "some title" 
        } as IArticle;
        
        const hydratedArticleItems = mock<QueryWithHelpers<Array<any>, any, any, any>>()

        hydratedArticleItems.exec
                            .mockResolvedValueOnce(articlePersisted)

        articleModel.findById
                    .calledWith(articleId, expect.objectContaining({ _id: 0 }))
                    .mockReturnValue(hydratedArticleItems);

        expect(await articleRepository.find(articleId)).toBe(articlePersisted);

        expect(articleModel.findById).toHaveBeenCalledTimes(1);
        expect(articleModel.findById).toHaveBeenCalledWith(articleId, expect.objectContaining({ _id: 0 }))
        
        expect(hydratedArticleItems.exec).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error when an article to retrieve is not found", async () => {
        let articleId = "123456789";
        
        const hydratedArticleItems = mock<QueryWithHelpers<Array<any>, any, any, any>>()

        hydratedArticleItems.exec
                            .mockResolvedValueOnce(null)

        articleModel.findById
                    .calledWith(articleId, expect.objectContaining({ _id: 0 }))
                    .mockReturnValue(hydratedArticleItems);

        await expect(articleRepository.find(articleId)).rejects
                                                       .toThrow(EntityNotFoundError);

        expect(articleModel.findById).toHaveBeenCalledTimes(1);
        expect(articleModel.findById).toHaveBeenCalledWith(articleId, expect.objectContaining({ _id: 0 }))
        
        expect(hydratedArticleItems.exec).toHaveBeenCalledTimes(1);
    });

    it("Should create an article", async () => {
        const article = {
            title: "some title",
            author: "some author",
            body: "some body"
        } as IArticle;

        (articleModel as any).create
                             .calledWith(article)
                             .mockResolvedValueOnce(article)

        expect(await articleRepository.create(article)).toBe(article);

        expect(articleModel.create).toHaveBeenCalledTimes(1);
        expect(articleModel.create).toHaveBeenCalledWith(article)
    });

    it("Should update an article", async () => {
        let articleId = "123456789";

        const article = {
            title: "some title",
            author: "some author",
            body: "some body"
        } as IArticle;

        articleModel.findByIdAndUpdate
                    .calledWith(articleId, article, expect.objectContaining({ new: true }))
                    .mockResolvedValueOnce(article);

        await articleRepository.update(articleId, article);

        expect(articleModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(articleModel.findByIdAndUpdate).toHaveBeenCalledWith(articleId, article, expect.objectContaining({ new: true }))
    });

    it("Should throw an error when an article to update is not found", async () => {
        let articleId = "123456789";

        const article = {
            title: "some title",
            author: "some author",
            body: "some body"
        } as IArticle;

        articleModel.findByIdAndUpdate
                    .calledWith(articleId, article, expect.objectContaining({ new: true }))
                    .mockResolvedValueOnce(null);

        await expect(articleRepository.update(articleId, article)).rejects
                                                                  .toThrow(EntityNotFoundError);

        expect(articleModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(articleModel.findByIdAndUpdate).toHaveBeenCalledWith(articleId, article, expect.objectContaining({ new: true }))
    });

    it("Should delete an article", async () => {
        let articleId = "123456789";

        const article = {
            title: "some title",
            author: "some author",
            body: "some body"
        } as IArticle;

        articleModel.findByIdAndDelete
                    .calledWith(articleId)
                    .mockResolvedValueOnce(article);

        await articleRepository.delete(articleId);

        expect(articleModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(articleModel.findByIdAndDelete).toHaveBeenCalledWith(articleId)
    });

    it("Should throw an error when an article to delete is not found", async () => {
        let articleId = "123456789";

        articleModel.findByIdAndDelete
                    .calledWith(articleId)
                    .mockResolvedValueOnce(null);

        await expect(articleRepository.delete(articleId)).rejects
                                                         .toThrow(EntityNotFoundError);

        expect(articleModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(articleModel.findByIdAndDelete).toHaveBeenCalledWith(articleId)
    });

    it("Should delete many articles", async () => {
        let filterQuery = { title: "some title" };

        articleModel.deleteMany
                    .calledWith(filterQuery as any);

        await articleRepository.deleteMany(filterQuery);

        expect(articleModel.deleteMany).toHaveBeenCalledTimes(1);
        expect(articleModel.deleteMany).toHaveBeenCalledWith(filterQuery)
    })
})