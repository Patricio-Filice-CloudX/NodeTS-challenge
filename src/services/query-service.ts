import { Request } from "express";
import { injectable } from "inversify";
import { PaginationRequest } from "../requests/paginaton-request";
import { SortOrder } from "../types";
import { IQueryService } from "./interfaces/iquery-service";
import { KeyQuery } from "./key-query";

@injectable()
export default class QueryService implements IQueryService {
    public getPaginatedRequest<T>(request: Request, defaultSort: keyof T): PaginationRequest {
        /// Pending to fix default sort to avoid the usage of unknown property names sent to the database, it dosen't breaks the query but a default property, choosed by the engine will, we used.
        const sortBy: keyof T = request.query.sortBy as keyof T || defaultSort;

        const page = (Number(request.query.page)) > 0 ? (Number(request.query.page)) : 1;
        const pageSize = Number(request.query.pageSize) > 0 ? (Number(request.query.pageSize)) : 1000;
        const sortOrderNumber = Number(request.query.sortOrder);
        const sortOrder: SortOrder = sortOrderNumber === 1 || sortOrderNumber === -1 ? sortOrderNumber : 1; 
        
        return new PaginationRequest(page, pageSize, sortBy as string, sortOrder);
    }

    public createQueryObject<R>(request: R, keysQueries: KeyQuery<R>[]): Record<keyof R, any> {
        return keysQueries.filter(kq => kq.hasValue(request))
                          .reduce((mkq, kq) => {
                            return kq.getQuery(request)(mkq);
                          }, {} as Record<keyof R, any>);
    }

    public addRegex<R>(request: R, keyQuery: KeyQuery<R>): (qo: Record<keyof R, any>) => Record<keyof R, any> {
        return (qo: Record<keyof R, any>) => {
            qo[keyQuery.key] = { $regex: '.*' + request[keyQuery.key] + '.*', $options: 'i' };
            return qo;
        }
    }
}