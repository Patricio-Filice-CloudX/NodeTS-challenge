import { IComment } from "../../models/comment.model";
import { IRepository } from "./irepository";

export interface ICommentRepository extends IRepository<IComment> { }