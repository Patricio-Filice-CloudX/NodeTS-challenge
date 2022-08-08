import { IArticle } from "../../models/article.model";
import { IRepository } from "./irepository";

export interface IArticleRepository extends IRepository<IArticle> { }