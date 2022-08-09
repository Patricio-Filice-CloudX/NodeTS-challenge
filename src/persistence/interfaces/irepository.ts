import { Document, FilterQuery, HydratedDocument, LeanDocument, Model, Require_id, UpdateQuery } from "mongoose";

export interface IRepository<TDocument extends Document> {
    list(query: FilterQuery<Model<TDocument>>): Promise<TDocument extends Document<any, any, any> ? LeanDocument<HydratedDocument<TDocument, {}, {}>>[] : LeanDocument<Require_id<TDocument>>[]>;

    find(id: string): Promise<TDocument>;

    create(document: TDocument): Promise<TDocument>;

    update(id: string, document: UpdateQuery<TDocument>): Promise<void>;

    delete(id: string): Promise<void>;

    deleteMany(filterQuery: FilterQuery<TDocument>): Promise<void>;
}