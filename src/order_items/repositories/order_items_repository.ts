import { getEM } from "../../core/database/adapter";
import { OrderItemEntity } from "../entities/order_items.entity";

export const OrderItemRepository = {
  async get_by_id_or_fail(id: number) {
    const em = await getEM();
    return em.findOneOrFail(OrderItemEntity, { id });
  },
  async save(order_item: OrderItemEntity) {
    const em = await getEM();
    await em.persistAndFlush(order_item);
    return order_item;
  },
  async list() {
    const em = await getEM();
    const order_items = await em.findAll(OrderItemEntity);
    return {
      data: order_items,
      pagination: {},
    };
  },
};
