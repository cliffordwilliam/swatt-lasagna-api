import { EntityManager } from "@mikro-orm/postgresql";
import { Order } from "../entities/order.entity";
import { FilterQuery } from "@mikro-orm/core";
import { OrderFilter } from "../schemas/order";

export const ORDER_REPOSITORY = {
  async getByIdOrFail(em: EntityManager, orderId: number) {
    return em.findOneOrFail(Order, { orderId });
  },

  async list(em: EntityManager, filters: OrderFilter) {
    const conditions: FilterQuery<Order>[] = [];

    if (filters.po) {
      conditions.push({ po: { $ilike: `%${filters.po}%` } });
    }

    if (filters.buyerId !== undefined) {
      conditions.push({ buyer: { personId: filters.buyerId } });
    }

    if (filters.recipientId !== undefined) {
      conditions.push({ recipient: { personId: filters.recipientId } });
    }

    if (filters.orderStatus) {
      conditions.push({ orderStatus: filters.orderStatus });
    }

    if (filters.payment) {
      conditions.push({ payment: filters.payment });
    }

    const where: FilterQuery<Order> =
      conditions.length === 0
        ? {}
        : filters.mode === "and"
          ? { $and: conditions }
          : { $or: conditions };

    const sortFieldMap: Record<string, keyof Order> = {
      po: "po",
      orderDate: "orderDate",
      deliveryDate: "deliveryDate",
      totalPurchase: "totalPurchase",
      grandTotal: "grandTotal",
    };

    const sortField = sortFieldMap[filters.sortField] ?? "orderDate";

    const [entities, totalCount] = await em.findAndCount(Order, where, {
      limit: filters.pageSize,
      offset: (filters.page - 1) * filters.pageSize,
      orderBy: { [sortField]: filters.sortOrder },
      populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
    });

    const totalPages = Math.ceil(totalCount / filters.pageSize);

    return {
      data: entities.map((entity) => {
        const {
          buyer,
          recipient,
          orderItems: orderItemsCollection,
          ...orderRest
        } = entity;
        return {
          ...orderRest,
          buyerId: buyer.personId,
          recipientId: recipient.personId,
          orderItems: Array.from(orderItemsCollection).map((oi) => ({
            itemId: oi.item.itemId,
            quantity: oi.quantity,
          })),
        };
      }),
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        totalCount,
        totalPages,
        hasNext: filters.page < totalPages,
        hasPrevious: filters.page > 1,
      },
    };
  },

  async save(em: EntityManager, order: Order) {
    em.persist(order);
    return order;
  },
};
