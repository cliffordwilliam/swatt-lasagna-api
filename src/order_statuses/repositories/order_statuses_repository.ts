import { getEM } from "../../core/database/adapter";
import { OrderStatusEntity } from "../entities/order_statuses.entity";

export const OrderStatusRepository = {
  async get_by_id_or_fail(id: number) {
    const em = await getEM();
    return em.findOneOrFail(OrderStatusEntity, { id });
  },
  async save(order_status: OrderStatusEntity) {
    const em = await getEM();
    await em.persistAndFlush(order_status);
    return order_status;
  },
  async list() {
    const em = await getEM();
    const order_statuses = await em.findAll(OrderStatusEntity);
    return {
      data: order_statuses,
      pagination: {},
    };
  },
};
