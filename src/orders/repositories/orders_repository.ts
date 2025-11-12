import { getEM } from "../../core/database/adapter";
import { OrderEntity } from "../entities/orders.entity";

export const OrderRepository = {
  async get_by_id_or_fail(id: number) {
    const em = await getEM();
    return em.findOneOrFail(OrderEntity, { id });
  },
  async save(order: OrderEntity) {
    const em = await getEM();
    await em.persistAndFlush(order);
    return order;
  },
  async list() {
    const em = await getEM();
    const orders = await em.findAll(OrderEntity);
    return {
      data: orders,
      pagination: {},
    };
  },
};
