import { EntityManager } from "@mikro-orm/postgresql";
import { Order } from "../entities/order.entity";

export const ORDER_REPOSITORY = {
  async getByIdOrFail(em: EntityManager, orderId: number) {
    return em.findOneOrFail(Order, { orderId });
  },

  async save(em: EntityManager, order: Order) {
    em.persist(order);
    return order;
  },
};
