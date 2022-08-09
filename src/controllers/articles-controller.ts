import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, httpPost, httpPut, request, response } from "inversify-express-utils";
import HEADERS from "../constants/headers";
import SERVICE_IDENTIFIERS from "../constants/service-identifiers";
import { IArticleService } from "../services/interfaces/iarticle-service";
import { ModelCreated } from "../services/model-created";

@controller("/articles")
export class ArticlesController extends BaseHttpController {

    constructor(@inject(SERVICE_IDENTIFIERS.ARTICLE_SERVICE) private readonly articleService: IArticleService) {
        super()
     }

    @httpGet("/")
    public async list(@request() req: Request, @response() _res: Response) {
        const articles = await this.articleService.list(req);
        return this.ok(articles);
    }

    @httpGet("/:articleId")
    public async get(@request() req: Request, @response() _res: Response) {
        const article = await this.articleService.get(req);
        return this.ok(article);
    }

    @httpPost("/")
    public async create(@request() req: Request, @response() _res: Response) {
        const articleId = await this.articleService.create(req);
        return this.created(HEADERS.LOCATION.CREATE(req, articleId), new ModelCreated(articleId));
    }

    @httpPut("/:articleId")
    public async update(@request() req: Request, @response() res: Response) {
        await this.articleService.update(req);
        return res.status(204)
                  .send();
    }

    @httpDelete("/:articleId")
    public async delete(@request() req: Request, @response() res: Response) {
        await this.articleService.delete(req);
        return res.status(204)
                  .send();
    }
}