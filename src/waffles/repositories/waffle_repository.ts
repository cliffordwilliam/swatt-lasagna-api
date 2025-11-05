import { getEM } from "../../orm";
import { WaffleEntity } from "../entities/waffle.entity";
import { WaffleFilter } from "../schemas/waffle";

export const WaffleRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async list(_filters: WaffleFilter) {
    const em = await getEM();
    return await em.find(WaffleEntity, {});
  },

  async create(waffle: WaffleEntity) {
    const em = await getEM();
    await em.persistAndFlush(waffle);
    return waffle;
  },
};
