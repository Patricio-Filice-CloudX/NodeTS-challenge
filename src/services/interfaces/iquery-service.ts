import { Request } from "express";
import { PaginationRequest } from "../../requests/paginaton-request";
import { KeyQuery } from "../key-query";

export interface IQueryService {
    getPaginatedRequest<T>(request: Request, defaultSort: keyof T): PaginationRequest;

    createQueryObject<R>(request: R, keysQueries: KeyQuery<R>[]): Record<keyof R, any>;

    /// Regex as a possible query, it's meant to add other methods based on the demand of the application, this method (and any other query transformation method) could be transformed into a tiny object which could be instantiated as we need it, to avoid growing up in methods the Query Service.
    addRegex<R>(request: R, keyQuery: KeyQuery<R>): (qo: Record<keyof R, any>) => Record<keyof R, any>;
}