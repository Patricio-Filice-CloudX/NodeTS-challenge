import { Request } from "express";
import { IArticle } from "../../models/article.model";

export interface IArticleService {
    create(request: Request): Promise<string>;

    list(request: Request): Promise<IArticle[]>;

    get(request: Request): Promise<IArticle>;
}