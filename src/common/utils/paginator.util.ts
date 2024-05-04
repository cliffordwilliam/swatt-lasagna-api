export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    if (typeof args.where === 'string') {
      try {
        args.where = JSON.parse(args.where);
      } catch (error) {
        console.error('Error parsing where:', error);
        throw new Error('Invalid where parameter');
      }
    }

    if (typeof args.orderBy === 'string') {
      try {
        args.orderBy = JSON.parse(args.orderBy);
      } catch (error) {
        console.error('Error parsing orderBy:', error);
        throw new Error('Invalid orderBy parameter');
      }
    }

    const page = Number(options?.page || defaultOptions?.page) || 1;
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;

    if (args.where && args.where.nama) {
      args.where.nama = {
        contains: args.where.nama.toLowerCase(),
        mode: 'insensitive',
      };
    }

    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
};
