import { Model, Document, Types } from 'mongoose';
import { from, Observable } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';

import {
  PaginationResult,
  PaginationOptions,
  paginate,
} from './mongoose-pagination';

/**
 * Allow basic operations
 *
 * @class
 */
export class MongooseService<D> {
  /**
   * Create a new document
   *
   * @param {I} args Properties of the new document
   * @returns {D} Observable with the new document
   */
  public async create(args: D): Promise<D> {
    const createdUser = new this.model(args);
    return await createdUser.save();
  }

  /**
   * Find a document by id
   *
   * @param {string} id Document id
   * @returns {D} Observable with the document or null if it doesn't exist
   */
  public findOneById(id: string): Promise<D> {
    return this.model.findOne({ _id: Types.ObjectId(id), deletedAt: null }).exec()  ;
  }

  /**
   * Paginate documents following https://graphql.org/learn/pagination/
   *
   * @param {PaginationOptions} options It is used to go over the data
   * @returns {PaginationResult<D>} Observable with pagination result
   */
  public paginate(options: PaginationOptions): Observable<PaginationResult<D>> {
    return paginate<D>(this.model, {
      ...options,
      query: {
        ...options.query,
        deletedAt: null,
      },
    });
  }

  /**
   * Remove a document by id
   *
   * @param {string} id Document id
   * @returns {D} Observable with the document removed or null if it doesn't exist
   */
  public removeById(id: string): Promise<D> {
    return this.model
        .findOneAndUpdate(
          {
            _id: id,
            deletedAt: null,
          },
          {
            $set: {
              deletedAt: new Date(),
            },
          },
        )
        .exec() ;

  }

  /**
   * Update a document
   *
   * @param {string} id document id
   * @param {I} args properties to be updated
   * @returns {D} Observable with the document updated or null if it doesn't exist
   */
  public update(id: string, args: D): Promise<D> {

      return this.model
        .findOneAndUpdate(
          {
            _id: id,
            deletedAt: null,
          },
          {
            $set: args,
          },
          {
            new: true,
          },
        )
        .exec();

  }

  public findAll(): Promise<D> {
    return this.model.find({deletedAt: null}).sort({updatedAt: -1}).exec();
  }

  constructor(private model) {}
}
