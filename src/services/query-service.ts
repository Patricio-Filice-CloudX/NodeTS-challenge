import { injectable } from "inversify";
import { IQueryService } from "./interfaces/iquery-service";
import { KeyQuery } from "./key-query";

@injectable()
export default class QueryService implements IQueryService {
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