import { Request } from "express";
import { Document } from "mongoose";

export interface ICrudService<TDocument extends Document> {
    create(request: Request): Promise<string>;

    list(request: Request): Promise<TDocument[]>;

    get(request: Request): Promise<TDocument>;

    update(request: Request): Promise<void>;

    delete(request: Request): Promise<void>;
}