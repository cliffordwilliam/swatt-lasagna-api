import { getEM } from "../../core/database/adapter";
import { PickupDeliveryEntity } from "../entities/pickup_deliveries.entity";

export const PickupDeliveryRepository = {
  async get_by_id_or_fail(id: number) {
    const em = await getEM();
    return em.findOneOrFail(PickupDeliveryEntity, { id });
  },
  async save(pickup_delivery: PickupDeliveryEntity) {
    const em = await getEM();
    await em.persistAndFlush(pickup_delivery);
    return pickup_delivery;
  },
  async list() {
    const em = await getEM();
    const pickup_deliveries = await em.findAll(PickupDeliveryEntity);
    return {
      data: pickup_deliveries,
      pagination: {},
    };
  },
};
