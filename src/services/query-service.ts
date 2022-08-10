import { Request } from "express";
import { injectable } from "inversify";
import { PaginationRequest } from "../requests/paginaton-request";
import { SortOrder } from "../types";
import { IQueryService } from "./interfaces/iquery-service";
import { KeyQuery } from "./key-query";

@injectable()
export default class QueryService implements IQueryService {
    public getPaginatedRequest<T>(request: Request, defaultSort: keyof T): PaginationRequest {
        const sortBy: keyof T = request.query.sortBy as keyof T || defaultSort;
        const page = (Number(request.query.page)) > 0 ? (Number(request.query.page)) : 1;
        const pageSize = Number(request.query.pageSize) > 0 ? (Number(request.query.pageSize)) : 1000;

        return new PaginationRequest(page, pageSize, sortBy as string, Number(request.query.sortOrder) as SortOrder || 1);
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