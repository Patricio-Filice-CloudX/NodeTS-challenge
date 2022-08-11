import 'reflect-metadata';
import { KeyQuery } from '../key-query';

describe("Key Query", () => {
    class KeyQueryDummyClass {
        key: string;

        constructor(key: string) {
            this.key = key;
        }
    }

    let keyQuery: KeyQuery<KeyQueryDummyClass>;
    let queryFunctionGetterMock: jest.Mock<(qo: Record<keyof KeyQueryDummyClass, any>) => Record<keyof KeyQueryDummyClass, any>>;

    beforeEach(() => {
      queryFunctionGetterMock = jest.fn();
      keyQuery = new KeyQuery("key", queryFunctionGetterMock);
    })

    it("Should check if object has key and value", () => {        
        let keyQueryDummyInstance = {
            key: "value"
        } as KeyQueryDummyClass;

        expect(keyQuery.hasValue(keyQueryDummyInstance)).toBeTruthy();
    });

    it("Should get query function", () => {        
        let keyQueryDummyInstance = {
            key: "value"
        } as KeyQueryDummyClass;

        const queryFunction = (qo: Record<keyof KeyQueryDummyClass, any>) => { 
                                return qo;
                              };
        queryFunctionGetterMock.mockReturnValueOnce(queryFunction);

        expect(keyQuery.getQuery(keyQueryDummyInstance)).toBe(queryFunction);

        expect(queryFunctionGetterMock).toBeCalledTimes(1);
        expect(queryFunctionGetterMock).toHaveBeenCalledWith(keyQueryDummyInstance, keyQuery);
    });
})