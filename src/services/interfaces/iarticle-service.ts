import { IArticle } from "../../models/article.model";
import { ICrudService } from "./icrud-service";

export interface IArticleService extends ICrudService<IArticle> { }