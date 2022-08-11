import { injectable } from 'inversify';
import { Model } from 'mongoose';
import { ArticleModel, IArticle } from '../../models/article.model';
import { IArticleModelWrapper } from '../interfaces/iarticle-model-wrapper';

@injectable()
export default class ArticleModelWrapper implements IArticleModelWrapper {
    getModel(): Model<IArticle, {}, {}, {}, any> {
        return ArticleModel;
    }
}