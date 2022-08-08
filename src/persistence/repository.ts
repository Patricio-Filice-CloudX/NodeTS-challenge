import { injectable } from 'inversify';
import { FilterQuery, Model, Document, HydratedDocument, Query } from 'mongoose'
import { EntityNotFoundError } from '../errors/entity-not-found-error';
import { IRepository } from './interfaces/irepository';

@injectable()
export default abstract class Repository<T extends Document> implements IRepository<T> {
    
    list(query: FilterQuery<Model<T>>): Promise<Array<T>> {
        return this.getModel()
                   .find(query)
                   .lean()
                   .exec() as Promise<Array<T>>;
    }

    async find(id: string): Promise<T> {
        let execPromise = this.execFind(this.getModel()
                                            .findById(id, { _id: 0 }));

        const entity = await execPromise;
        return this.throwIfNotExists(entity);
    }

    create(document: T): Promise<T> {
        return this.getModel()
                   .create(document);
    }

    async update(id: string, document: T): Promise<void> {
        await Model<T>.findByIdAndUpdate(id, document, { new: true }, (_err, doc, _res) => {
            this.throwIfNotExists(doc);
        });
    }

    protected abstract getModel(): Model<T, {}, {}, {}, any>

    protected abstract execFind(query: Query<HydratedDocument<T, {}, {}> | null, HydratedDocument<T, {}, {}>, {}, T>): Promise<T | null>;

    private throwIfNotExists(entity: T | null) : T  {
        if (!entity) {
            throw new EntityNotFoundError(typeof(entity));  
        }

        return entity;
    }
}