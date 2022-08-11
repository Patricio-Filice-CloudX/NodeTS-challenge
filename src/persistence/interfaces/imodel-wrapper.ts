import { Document, Model } from "mongoose";

export interface IModelWrapper<TDocument extends Document> {
    getModel():  Model<TDocument, {}, {}, {}, any>;
}