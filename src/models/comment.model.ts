import { Document, Schema, model } from "mongoose";
import { IArticle } from "./article.model";

/// Would have been more useful to use the createdAt property as a sort value. Wasn't added to be more focused on other components of the project.
export interface IComment extends Document {
    body: string;
    author: string;
    article: IArticle;
    id: string;
}

const commentSchema = new Schema<IComment>({
    body: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 500
    },
    author: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article",
        required: true
    }
},
{
    timestamps: true
});

export const CommentModel = model<IComment>("Comment", commentSchema);