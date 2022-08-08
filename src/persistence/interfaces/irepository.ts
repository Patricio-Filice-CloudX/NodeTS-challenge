import { Document, FilterQuery, Model } from "mongoose";

export interface IRepository<T extends Document> {
    list(query: FilterQuery<Model<T>>): Promise<Array<T>>;

    find(id: string): Promise<T>;

    create(document: T): Promise<T>;

    update(id: string, document: T): Promise<void>;
}