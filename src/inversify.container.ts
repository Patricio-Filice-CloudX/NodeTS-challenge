import { Container } from 'inversify';
import { IArticleRepository } from './persistence/interfaces/iarticle-repository';
import { IArticleService } from './services/interfaces/iarticle-service';
import SERVICE_IDENTIFIERS from './constants/service-identifiers';
import REPOSITORY_IDENTIFIERS from './constants/repository-identifiers';
import ArticleService from './services/article-service';
import CommentService from './services/comment-service';
import { ArticleRepository } from './persistence/article-repository';
import { IQueryService } from './services/interfaces/iquery-service';
import QueryService from './services/query-service';
import { ICommentRepository } from './persistence/interfaces/icomment-repository';
import { CommentRepository } from './persistence/comment-repository';
import { ICommentService } from './services/interfaces/icomment-service';
import { IArticleModelWrapper } from './persistence/interfaces/iarticle-model-wrapper';
import MODELS_WRAPPERS from './constants/models-wrappers';
import ArticleModelWrapper from './persistence/model-wrappers/article-model-wrapper';
import { ICommentModelWrapper } from './persistence/interfaces/icomment-model-wrapper';
import CommentModelWrapper from './persistence/model-wrappers/comment-model-wrapper';
const container = new Container();

container.bind<IQueryService>(SERVICE_IDENTIFIERS.QUERY_SERVICE).to(QueryService);
container.bind<IArticleService>(SERVICE_IDENTIFIERS.ARTICLE_SERVICE).to(ArticleService);
container.bind<ICommentService>(SERVICE_IDENTIFIERS.COMMENT_SERVICE).to(CommentService);
container.bind<IArticleModelWrapper>(MODELS_WRAPPERS.ARTICLE_WRAPPER).to(ArticleModelWrapper);
container.bind<ICommentModelWrapper>(MODELS_WRAPPERS.COMMENT_WRAPPER).to(CommentModelWrapper);
container.bind<IArticleRepository>(REPOSITORY_IDENTIFIERS.ARTICLE_REPOSITORY).to(ArticleRepository);
container.bind<ICommentRepository>(REPOSITORY_IDENTIFIERS.COMMENT_REPOSITORY).to(CommentRepository);

export default container;