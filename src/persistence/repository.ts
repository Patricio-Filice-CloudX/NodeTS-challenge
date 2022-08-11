import { injectable } from 'inversify';
import { FilterQuery, Document, HydratedDocument, Query, UpdateQuery, LeanDocument } from 'mongoose'
import { EntityNotFoundError } from '../errors/entity-not-found-error';
import { PaginationRequest } from '../requests/paginaton-request';
import { EntityName } from '../types';
import { IModelWrapper } from './interfaces/imodel-wrapper';
import { IRepository } from './interfaces/irepository';
import { PaginatedResult } from './paginated-result';

@injectable()
export default abstract class Repository<TDocument extends Document> implements IRepository<TDocument> {
    
    constructor(private readonly modelWrapper: IModelWrapper<TDocument>) { }

    protected abstract entityName: EntityName;

    async list(query: FilterQuery<TDocument>, paginationRequest: PaginationRequest, mapTo: (document: LeanDocument<HydratedDocument<TDocument, {}, {}>>) => TDocument): Promise<PaginatedResult<TDocument>> {
        const totalCountPromise =  this.getModel()
                                       .count(query)                                      
                                       .exec();

        /// Won't scale with large data sets, it's recommended to use cursors. Weren't implemented to reduce the complexity of the challenge.
        const pageItemsPromise = this.getModel()
                                     .find(query)
                                     .lean()
                                     .sort(paginationRequest.getSort())
                                     .skip(paginationRequest.getSkipped())
                                     .limit(paginationRequest.pageSize)
                                     .exec();

        const [totalCount, pageItems] = await Promise.all([totalCountPromise, pageItemsPromise]);
        const pageCount = Math.floor((totalCount - 1) / paginationRequest.pageSize) + 1;
        return new PaginatedResult(totalCount, pageCount, pageItems.map(d => mapTo(d)));
    }

    async find(id: string): Promise<TDocument> {
        let execPromise = this.execFind(this.getModel()
                                            .findById(id, { _id: 0 }));

        const entity = await execPromise;
        return this.throwIfNotExists(entity);
    }

    create(document: TDocument): Promise<TDocument> {
        return this.getModel()
                   .create(document);
    }

    async update(id: string, document: UpdateQuery<TDocument>): Promise<void> {
        const model = await this.getModel()
                                .findByIdAndUpdate(id, document, { new: true });
        this.throwIfNotExists(model);
    }

    async delete(id: string): Promise<void> {
        const model = await this.getModel()
                                .findByIdAndDelete(id);
        this.throwIfNotExists(model);
    }

    async deleteMany(filterQuery: FilterQuery<TDocument>): Promise<void> {
        await this.getModel()
                  .deleteMany(filterQuery);
    }

    protected getModel() {
        return this.modelWrapper.getModel();
    }

    protected abstract execFind(query: Query<HydratedDocument<TDocument, {}, {}> | null, HydratedDocument<TDocument, {}, {}>, {}, TDocument>): Promise<TDocument | null>;

    private throwIfNotExists(entity: TDocument | null) : TDocument {
        if (!entity) {
            throw new EntityNotFoundError(this.entityName);  
        }

        return entity;
    }
}