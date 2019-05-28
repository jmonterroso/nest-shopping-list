import { Model, Document } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

export interface PaginationOptions {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  query?: any;
  search?: { by: string; like: string };
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

export interface PaginationResult<T> {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
  edges: Array<Edge<T>>;
  totalCount: number;
}

export const paginate = <T>(
  model: Model<T>,
  options: PaginationOptions,
): Observable<PaginationResult<T>> => {
  const edges = () => {
    let conditions = {
      ...options.query,
    };

    if (options.before) {
      conditions = {
        ...conditions,
        _id: {
          $lt: Buffer.from(options.before, 'base64').toString(),
        },
      };
    }

    if (options.after) {
      conditions = {
        ...conditions,
        _id: {
          $gt: Buffer.from(options.after, 'base64').toString(),
        },
      };
    }

    return from(
      model
        .find(conditions)
        .limit(options.first || options.last || 100)
        .sort({ _id: options.last ? -1 : 1 })
        .exec(),
    ).pipe(
      map((documents: any[]) => {
        if (options.last) {
          documents.reverse();
        }

        return documents.map(document => ({
          node: document,
          cursor: Buffer.from(document.id).toString('base64'),
        }));
      }),
      map((edges: Array<Edge<any>>) => {

        return {
          edges,
          pageInfo: {
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: (edges.length === options.first || edges.length === options.last) ? edges[edges.length - 1].cursor : null,
          },
        };
      }),
    );
  };
  const hasNextPage = ({ pageInfo, ...args }: any) => {

    if (!pageInfo.endCursor) {
      return of({
        ...args,
        pageInfo: {
          ...pageInfo,
          hasNextPage: false,
        },
      });
    }

    return from(
      model
        .find({
          ...options.query,
          _id: {
            ['$gt']: Buffer.from(pageInfo.endCursor, 'base64').toString(),
          },
        })
        .select({ _id: 1 })
        .limit(1)
        .estimatedDocumentCount()
        .exec(),
    ).pipe(
      map((count: number) => {
        return {
          ...args,
          pageInfo: {
            ...pageInfo,
            hasNextPage: count > 0,
          },
        };
      }),
    );
  };
  const hasPreviousPage = ({ pageInfo, ...args }: any) => {
    if (!pageInfo.startCursor) {
      return of({
        ...args,
        pageInfo: {
          ...pageInfo,
          hasPreviousPage: false,
        },
      });
    }

    return from(
      model
        .find({
          ...options.query,
          _id: {
            ['$lt']: Buffer.from(pageInfo.startCursor, 'base64').toString(),
          },
        })
        .select({ _id: 1 })
        .limit(1)
        .count()
        .exec(),
    ).pipe(
      map((count: number) => {
        return {
          ...args,
          pageInfo: {
            ...pageInfo,
            hasPreviousPage: count > 0,
          },
        };
      }),
    );
  };
  const totalCount = (args: any) => {
    return from(
      model
        .find(options.query)
        .count()
        .exec(),
    ).pipe(
      map((count: number) => {
        return {
          ...args,
          totalCount: count,
        };
      }),
    );
  };

  if (options.search) {
    const { search } = options;
    options.query = {
      ...options.query,
      [search.by]: { $regex: `.*${search.like}.*`, $options : 'i' },
    };
  }

  return edges().pipe(
    concatMap((args: any) => hasNextPage(args)),
    concatMap((args: any) => hasPreviousPage(args)),
    concatMap((args: any) => totalCount(args)),
  );
};
