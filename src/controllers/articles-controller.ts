import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, request, response } from "inversify-express-utils";
import SERVICE_IDENTIFIERS from "../constants/service-identifiers";
import { IArticleService } from "../services/interfaces/iarticle-service";

@controller('/articles')
export class ArticlesController {

    constructor(@inject(SERVICE_IDENTIFIERS.ARTICLE_SERVICE) private readonly articleService: IArticleService) { }

    @httpGet("/")
    public async get(@request() req: Request, @response() res: Response) {
        const articles = this.articleService.list(req);
        return res.json(articles);
    }
}