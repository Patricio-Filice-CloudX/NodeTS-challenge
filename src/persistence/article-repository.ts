import { inject, injectable } from "inversify";
import { Model, Query, Types } from "mongoose";
import MODELS_WRAPPERS from "../constants/models-wrappers";
import { IArticle, ArticleModel } from "../models/article.model";
import { EntityName } from "../types";
import { IArticleModelWrapper } from "./interfaces/iarticle-model-wrapper";
import { IArticleRepository } from "./interfaces/iarticle-repository";
import Repository from "./repository";

@injectable()
export class ArticleRepository extends Repository<IArticle> implements IArticleRepository {
    protected entityName: EntityName = 'Article';
    
    constructor(@inject(MODELS_WRAPPERS.ARTICLE_WRAPPER) articleModelWrapper: IArticleModelWrapper) {
        super(articleModelWrapper)
    }

    protected getModel(): Model<IArticle, {}, {}, {}, any> {
        return ArticleModel;
    }
    protected execFind(query: Query<(IArticle & { _id: Types.ObjectId; }) | null, IArticle & { _id: Types.ObjectId; }, {}, IArticle>): Promise<IArticle | null> {
        return query.exec();
    }
}