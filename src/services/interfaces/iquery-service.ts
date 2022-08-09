import { KeyQuery } from "../key-query";

export interface IQueryService {
    createQueryObject<R>(request: R, keysQueries: KeyQuery<R>[]): Record<keyof R, any>;

    addRegex<R>(request: R, keyQuery: KeyQuery<R>): (qo: Record<keyof R, any>) => Record<keyof R, any>;
}