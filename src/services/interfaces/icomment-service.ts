import { IComment } from "../../models/comment.model";
import { ICrudService } from "./icrud-service";

export interface ICommentService extends ICrudService<IComment> { }