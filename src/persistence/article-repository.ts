import { injectable } from "inversify";
import { Model, Query, Types } from "mongoose";
import { IArticle, ArticleModel } from "../models/article.model";
import { IArticleRepository } from "./interfaces/iarticle-repository";
import Repository from "./repository";

@injectable()
export class ArticleRepository extends Repository<IArticle> implements IArticleRepository {
    protected getModel(): Model<IArticle, {}, {}, {}, any> {
        return ArticleModel;
    }
    protected execFind(query: Query<(IArticle & { _id: Types.ObjectId; }) | null, IArticle & { _id: Types.ObjectId; }, {}, IArticle>): Promise<IArticle | null> {
        return query.exec();
    }
}