import { Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController, controller, httpDelete, httpGet, httpPost, httpPut, request, response } from "inversify-express-utils";
import HEADERS from "../constants/headers";
import SERVICE_IDENTIFIERS from "../constants/service-identifiers";
import { ICommentService } from "../services/interfaces/icomment-service";
import { ModelCreated } from "../services/model-created";

@controller("/articles/:articleId/comments")
export class CommentsController extends BaseHttpController {

    constructor(@inject(SERVICE_IDENTIFIERS.COMMENT_SERVICE) private readonly commentService: ICommentService) {
        super()
     }

    @httpGet("/")
    public async list(@request() req: Request, @response() _res: Response) {
        const comments = await this.commentService.list(req);
        return this.ok(comments);
    }

    @httpGet("/:commentId")
    public async get(@request() req: Request, @response() _res: Response) {
        const comment = await this.commentService.get(req);
        return this.ok(comment);
    }

    @httpPost("/")
    public async post(@request() req: Request, @response() _res: Response) {
        const commentId = await this.commentService.create(req);
        return this.created(HEADERS.LOCATION.CREATE(req, commentId), new ModelCreated(commentId));
    }

    @httpPut("/:commentId")
    public async put(@request() req: Request, @response() res: Response) {
        await this.commentService.update(req);
        return res.status(204)
                  .send();
    }

    @httpDelete("/:commentId")
    public async delete(@request() req: Request, @response() res: Response) {
        await this.commentService.delete(req);
        return res.status(204)
                  .send();
    }
}