import { Document, FilterQuery, HydratedDocument, LeanDocument, Model, UpdateQuery } from "mongoose";
import { PaginationRequest } from "../../requests/paginaton-request";
import { PaginatedResult } from "../paginated-result";

export interface IRepository<TDocument extends Document> {
    list(query: FilterQuery<Model<TDocument>>, paginationRequest: PaginationRequest, mapTo: (document: LeanDocument<HydratedDocument<TDocument, {}, {}>>) => TDocument): Promise<PaginatedResult<TDocument>>;

    find(id: string): Promise<TDocument>;

    create(document: TDocument): Promise<TDocument>;

    update(id: string, document: UpdateQuery<TDocument>): Promise<void>;

    delete(id: string): Promise<void>;

    deleteMany(filterQuery: FilterQuery<TDocument>): Promise<void>;
}