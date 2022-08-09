import { injectable } from "inversify";
import { Model, Query, Types } from "mongoose";
import { CommentModel, IComment } from "../models/comment.model";
import { EntityName } from "../types";
import { ICommentRepository } from "./interfaces/icomment-repository";
import Repository from "./repository";

@injectable()
export class CommentRepository extends Repository<IComment> implements ICommentRepository {
    protected entityName: EntityName = 'Comment';

    protected getModel(): Model<IComment, {}, {}, {}, any> {
        return CommentModel;
    }
    protected execFind(query: Query<(IComment & { _id: Types.ObjectId; }) | null, IComment & { _id: Types.ObjectId; }, {}, IComment>): Promise<IComment | null> {
        return query.populate('article')
                    .exec();
    }
}