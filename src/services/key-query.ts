export class KeyQuery<R> {
    key: keyof R;
    private query: (request: R, keyQuery: KeyQuery<R>) => (qo: Record<keyof R, any>) => Record<keyof R, any>;

    constructor(key: keyof R, query: (request: R, keyQuery: KeyQuery<R>) => (qo: Record<keyof R, any>) => Record<keyof R, any>) {
        this.key = key;
        this.query = query;
    }

    hasValue(request: R): boolean {
        return !!request[this.key];
    }

    getQuery(request: R): (qo: Record<keyof R, any>) => Record<keyof R, any> {
        return this.query(request, this);
    }
}