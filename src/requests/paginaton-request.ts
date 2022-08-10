import mongoose from "mongoose";
import { SortOrder } from "../types";

export class PaginationRequest {
    private page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: SortOrder;

    getPage(): number {
        return this.page - 1;
    }

    getSkipped(): number {
        return this.getPage() * this.pageSize; 
    };

    getSort(): { [key: string]: mongoose.SortOrder | { $meta: 'textScore' } } {
        return { [this.sortBy]: this.sortOrder };
    }

    constructor(page: number, pageSize: number, sortBy: string, sortOrder: SortOrder) {
        this.page = page;
        this.pageSize = pageSize;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
    }
}