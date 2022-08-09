import { Document, Schema, model } from "mongoose";

export interface IArticle extends Document {
    title: string;
    body: string;
    author: string;
    id: string;
}

const articleSchema = new Schema<IArticle>({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
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
    }
},
{
    timestamps: true
});

export const ArticleModel = model<IArticle>("Article", articleSchema);