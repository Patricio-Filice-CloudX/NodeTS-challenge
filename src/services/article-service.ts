import { Request } from "express";
import { inject, injectable } from "inversify";
import SERVICE_IDENTIFIERS from "../constants/service-identifiers";
import { IArticle } from "../models/article.model";
import { IArticleRepository } from "../persistence/interfaces/iarticle-repository";
import { IArticleService } from "./interfaces/iarticle-service";
//import { KeyQuery } from "./key-query";
import { QueryService } from "./query-service";

@injectable()
export default class ArticleService extends QueryService implements IArticleService {
    constructor(@inject(SERVICE_IDENTIFIERS.ARTICLE_REPOSITORY) private readonly articleRepository: IArticleRepository) {
        super()
     }

    public async create(request: Request): Promise<string> {
        const article = {
            author: request.body.author,
            body: request.body.body,
            title: request.body.title
        } as IArticle;

        const persistedArticle = await this.articleRepository.create(article);
        return persistedArticle.id;
    }

    public async list(_request: Request): Promise<IArticle[]> {
        //const queryObject = this.createQueryObject<any, any>(request.params, [
            /*new KeyQuery("title", this.addRegex),
            new KeyQuery("author", this.addRegex),
            new KeyQuery("body", this.addRegex)*/
        //]);
        return this.articleRepository.list({});
    }

    public async get(request: Request): Promise<IArticle> {
        return this.articleRepository.find(request.params.id);
    }
}