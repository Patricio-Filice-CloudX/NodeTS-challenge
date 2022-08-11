import { inject, injectable } from "inversify";
import { Model, Query, Types } from "mongoose";
import MODELS_WRAPPERS from "../constants/models-wrappers";
import { CommentModel, IComment } from "../models/comment.model";
import { EntityName } from "../types";
import { ICommentModelWrapper } from "./interfaces/icomment-model-wrapper";
import { ICommentRepository } from "./interfaces/icomment-repository";
import Repository from "./repository";

@injectable()
export class CommentRepository extends Repository<IComment> implements ICommentRepository {
    protected entityName: EntityName = 'Comment';

    constructor(@inject(MODELS_WRAPPERS.COMMENT_WRAPPER) commentModelWrapper: ICommentModelWrapper) {
        super(commentModelWrapper)
    }

    protected getModel(): Model<IComment, {}, {}, {}, any> {
        return CommentModel;
    }
    protected execFind(query: Query<(IComment & { _id: Types.ObjectId; }) | null, IComment & { _id: Types.ObjectId; }, {}, IComment>): Promise<IComment | null> {
        return query.populate('article')
                    .exec();
    }
}