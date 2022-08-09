import "reflect-metadata";
import express from 'express';
import logger from 'morgan';
import { InversifyExpressServer, RoutingConfig } from 'inversify-express-utils';
import "./controllers/comments-controller";
import "./controllers/articles-controller";
import { start } from './start';
import container from "./inversify.container";
import { errorBusinessHandler } from "./middlewares/handlers/errors/error-business-handler";
import { errorHandler } from "./middlewares/handlers/errors/error-handler";
import { apiNotFoundHandler } from "./middlewares/handlers/api-not-found-handler";
import { mongooseValidationHandler } from "./middlewares/handlers/errors/mongoose-validation-handler";

const PORT = 3000;
const DATABASE_CONNECTION = 'mongodb://localhost';
const LOGGER_CONFIGURATION = 'dev';

const server = new InversifyExpressServer(container, null, { rootPath: '/api' } as RoutingConfig);

server.setConfig((app) => {
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());
  app.use(logger(LOGGER_CONFIGURATION));
});
const app = server.build();

app.use(errorBusinessHandler,
        mongooseValidationHandler,      
        errorHandler,
        apiNotFoundHandler);

start(app, DATABASE_CONNECTION, PORT);