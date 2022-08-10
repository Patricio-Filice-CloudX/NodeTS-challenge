import { Document } from "mongoose";

export class PaginatedResult<TDocument extends Document> {
    totalCount: number;
    pageCount: number; 
    pageItems:  TDocument[];

    constructor(totalCount: number, pageCount: number, pageItems:  TDocument[]) {
        this.totalCount = totalCount;
        this.pageCount = pageCount;
        this.pageItems = pageItems;
    }
}