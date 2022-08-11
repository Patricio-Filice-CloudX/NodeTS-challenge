import { Request } from 'express';
import 'reflect-metadata';
import { KeyQuery } from '../key-query';
import QueryService from '../query-service';

describe("Key Query", () => {
    class DummyQueryableEntity {
        firstProperty: string;
        secondProperty: string;

        constructor(firstProperty: string, secondProperty: string) {
            this.firstProperty = firstProperty;
            this.secondProperty = secondProperty;
        }
    }

    let queryService: QueryService;

    beforeEach(() => {
      queryService = new QueryService();
    })

    it("Should get paginated request", () => {        
        let request = {
            query: {
                page: 3,
                pageSize: 10,
                sortBy: 'key',
                sortOrder: -1   
            } as any
        } as Request;
        
        let paginatedRequest = queryService.getPaginatedRequest<DummyQueryableEntity>(request, 'firstProperty');
        let sort = paginatedRequest.getSort();

        expect(paginatedRequest.getPage()).toBe(2);
        expect(paginatedRequest.getSkipped()).toBe(20);
        expect(sort.key).toBe(-1);
    });

    it("Should get paginated request with default page", () => {        
        let request = {
            query: {
                pageSize: 10,
                sortBy: 'secondProperty',
                sortOrder: -1   
            } as any
        } as Request;
        
        let paginatedRequest = queryService.getPaginatedRequest<DummyQueryableEntity>(request, 'firstProperty');
        let sort = paginatedRequest.getSort();

        expect(paginatedRequest.getPage()).toBe(0);
        expect(paginatedRequest.getSkipped()).toBe(0);
        expect(sort.secondProperty).toBe(-1);
    });

    it("Should get paginated request with default pageSize", () => {        
        let request = {
            query: {
                page: 3,
                sortBy: 'er',
                sortOrder: -1   
            } as any
        } as Request;
        
        let paginatedRequest = queryService.getPaginatedRequest<DummyQueryableEntity>(request, 'firstProperty');
        let sort = paginatedRequest.getSort();

        expect(paginatedRequest.getPage()).toBe(2);
        expect(paginatedRequest.getSkipped()).toBe(2000);
        expect(sort.er).toBe(-1);
    });

    it("Should get paginated request with default sortBy", () => {        
        let request = {
            query: {
                page: 3,
                pageSize: 10,
                sortOrder: -1
            } as any
        } as Request;
        
        let paginatedRequest = queryService.getPaginatedRequest<DummyQueryableEntity>(request, 'firstProperty');
        let sort = paginatedRequest.getSort();

        expect(paginatedRequest.getPage()).toBe(2);
        expect(paginatedRequest.getSkipped()).toBe(20);
        expect(sort.firstProperty).toBe(-1);
    });

    it("Should get paginated request with default sortBy", () => {        
        let request = {
            query: {
                page: 3,
                pageSize: 10,
                sortOrder: -4
            } as any
        } as Request;
        
        let paginatedRequest = queryService.getPaginatedRequest<DummyQueryableEntity>(request, 'firstProperty');
        let sort = paginatedRequest.getSort();

        expect(paginatedRequest.getPage()).toBe(2);
        expect(paginatedRequest.getSkipped()).toBe(20);
        expect(sort.firstProperty).toBe(1);
    });

    it("Should get query object", () => {        
        let query = {
                firstProperty: '123'
        } as any;
        
        let queryFunctionGetterMock = jest.fn()
                                          .mockReturnValueOnce((qo: Record<string, any>) => {
                                                qo.firstProperty = '123';
                                                return qo;
                                          });

        let keyQuery = new KeyQuery<DummyQueryableEntity>("firstProperty", queryFunctionGetterMock);

        let queryObject = queryService.createQueryObject<DummyQueryableEntity>(query, [keyQuery]);

        expect(queryObject.firstProperty).toBe('123');
        expect(queryFunctionGetterMock).toBeCalledTimes(1);
        expect(queryFunctionGetterMock).toBeCalledWith(query, keyQuery);
    });

    it("Should add regex to query object", () => {        
        let query = {
                firstProperty: '123'
        } as any;
        
        let queryFunctionGetterMock = jest.fn();

        let keyQuery = new KeyQuery<DummyQueryableEntity>("firstProperty", queryFunctionGetterMock);

        let queryObject = queryService.addRegex<DummyQueryableEntity>(query, keyQuery)({} as Record<keyof DummyQueryableEntity, any>);

        expect(queryObject.firstProperty.$regex).toBe(".*123.*");
        expect(queryObject.firstProperty.$options).toBe("i");
    });
})