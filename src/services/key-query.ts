export class KeyQuery<R, K extends keyof R> {
    key: K;
    private query: (request: R, keyQuery: KeyQuery<R, K>) => (qo: Map<string, any>) => Map<string, any>;

    constructor(key: K, query: (request: R, keyQuery: KeyQuery<R, K>) => (qo: Map<string, any>) => Map<string, any>) {
        this.key = key;
        this.query = query;
    }

    hasValue(request: R): boolean {
        return !!request[this.key];
    }

    getQuery(request: R): (qo: Map<string, any>) => Map<string, any> {
        return this.query(request, this);
    }
}