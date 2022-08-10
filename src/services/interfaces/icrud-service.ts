import { Request } from "express";
import { Document } from "mongoose";
import { PaginatedResult } from "../../persistence/paginated-result";

export interface ICrudService<TDocument extends Document> {
    create(request: Request): Promise<string>;

    list(request: Request): Promise<PaginatedResult<TDocument>>;

    get(request: Request): Promise<TDocument>;

    update(request: Request): Promise<void>;

    delete(request: Request): Promise<void>;
}