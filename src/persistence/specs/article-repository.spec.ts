import 'reflect-metadata';
import { ArticleRepository } from '../article-repository';
import { PaginationRequest } from '../../requests/paginaton-request';
import { IArticle } from '../../models/article.model';
import { mock, MockProxy } from 'jest-mock-extended';
import { HydratedDocument, Model, QueryWithHelpers } from 'mongoose';
import { IArticleModelWrapper } from '../interfaces/iarticle-model-wrapper';

xdescribe("Article Repository", () => {
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

        const hydratedArticleCount = mock<QueryWithHelpers<number, HydratedDocument<IArticle, {}, {}>, {}, any>>()
        const hydratedArticleItems = mock<QueryWithHelpers<Array<any>, any, any, any>>()
        
        hydratedArticleCount.exec
                            .mockResolvedValueOnce(totalCount);

        articleModel.count
                    .calledWith(query)
                    .mockReturnValue(hydratedArticleCount);
        
        hydratedArticleItems.lean
                            .mockReturnThis();

        hydratedArticleItems.sort
                            .calledWith(expect.objectContaining(paginationRequest.getSort()))
                            .mockReturnThis();
                            
        hydratedArticleItems.skip
                            .calledWith(paginationRequest.getSkipped())
                            .mockReturnThis();
    
        hydratedArticleItems.limit
                            .calledWith(paginationRequest.pageSize)
                            .mockReturnThis();                    

        hydratedArticleItems.exec
                            .mockResolvedValueOnce(articlesPersisted);  

        articleModel.find
                    .calledWith(query as any)
                    .mockReturnValue(hydratedArticleItems);

        const paginatedResult = await articleRepository.list(query, paginationRequest, (a) => a);

        expect(paginatedResult.totalCount).toBe(totalCount);
        expect(paginatedResult.pageCount).toBe(2);
        expect(paginatedResult.pageItems).toBe(expect.arrayContaining([expect.objectContaining({ title: "some title" } as IArticle)]));
    });

    it("Should find article", async () => {
        let articleId = "123456789";

        const articlePersisted = {
            title: "some title" 
        } as IArticle;
        
        const hydratedArticleItems = mock<QueryWithHelpers<Array<any>, any, any, any>>()

        hydratedArticleItems.exec
                            .mockResolvedValueOnce(articlePersisted)

        articleModel.find
                    .calledWith({ id: articleId } as any)
                    .mockReturnValue(hydratedArticleItems);

        expect(await articleRepository.find(articleId)).toBe(articlePersisted);
    });
})