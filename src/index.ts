import "reflect-metadata";
import express from 'express';
import logger from 'morgan';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import "./controllers/articles-controller";
import { start } from './start';
import { IArticleService } from "./services/interfaces/iarticle-service";
import SERVICE_IDENTIFIERS from "./constants/service-identifiers";
import ArticleService from "./services/article-service";
import { IArticleRepository } from "./persistence/interfaces/iarticle-repository";
import { ArticleRepository } from "./persistence/article-repository";

const PORT = 3000;
const DATABASE_CONNECTION = "mongodb://localhost";

let container = new Container();
container.bind<IArticleService>(SERVICE_IDENTIFIERS.ARTICLE_SERVICE).to(ArticleService);
container.bind<IArticleRepository>(SERVICE_IDENTIFIERS.ARTICLE_REPOSITORY).to(ArticleRepository);

// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
  // add body parser
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());
  app.use(logger('dev'));
});
let app = server.build();

start(app, DATABASE_CONNECTION, PORT);