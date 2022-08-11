import { injectable } from "inversify";
import { Model } from "mongoose";
import { CommentModel, IComment } from "../../models/comment.model";
import { ICommentModelWrapper } from "../interfaces/icomment-model-wrapper";

@injectable()
export default class CommentModelWrapper implements ICommentModelWrapper {
    getModel(): Model<IComment, {}, {}, {}, any> {
        return CommentModel;
    }
}