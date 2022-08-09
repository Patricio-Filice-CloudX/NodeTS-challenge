import { injectable } from 'inversify';
import { FilterQuery, Model, Document, HydratedDocument, Query, LeanDocument, Require_id, UpdateQuery } from 'mongoose'
import { EntityNotFoundError } from '../errors/entity-not-found-error';
import { EntityName } from '../types';
import { IRepository } from './interfaces/irepository';

@injectable()
export default abstract class Repository<TDocument extends Document> implements IRepository<TDocument> {
    
    protected abstract entityName: EntityName;

    list(query: FilterQuery<TDocument>): Promise<TDocument extends Document<any, any, any> ? LeanDocument<HydratedDocument<TDocument, {}, {}>>[] : LeanDocument<Require_id<TDocument>>[]> {
        return this.getModel()
                   .find(query)
                   .lean()
                   .exec();
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

    protected abstract getModel(): Model<TDocument, {}, {}, {}, any>

    protected abstract execFind(query: Query<HydratedDocument<TDocument, {}, {}> | null, HydratedDocument<TDocument, {}, {}>, {}, TDocument>): Promise<TDocument | null>;

    private throwIfNotExists(entity: TDocument | null) : TDocument {
        if (!entity) {
            throw new EntityNotFoundError(this.entityName);  
        }

        return entity;
    }
}