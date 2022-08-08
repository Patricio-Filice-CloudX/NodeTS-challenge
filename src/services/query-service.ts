import { injectable } from "inversify";
import { KeyQuery } from "./key-query";

@injectable()
export abstract class QueryService {
    protected createQueryObject<R, K extends keyof R>(request: R, keysQueries: KeyQuery<R, K>[]): Map<string, any> {
        return keysQueries.filter(kq => kq.hasValue(request))
                          .reduce((mkq, kq) => {
                            return kq.getQuery(request)(mkq);
                          }, new Map<string, any>());
    }

    protected addRegex<R, K extends keyof R>(request: R, keyQuery: KeyQuery<R, K>): (qo: Map<string, any>) => Map<string, any> {
        return (qo: Map<string, any>) => {
            return qo.set(keyQuery.key as string, { $regex: request[keyQuery.key], $options: 'i' });
        }
    }
}