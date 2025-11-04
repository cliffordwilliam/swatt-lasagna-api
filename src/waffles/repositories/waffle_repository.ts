import { WaffleCreateRequest, WaffleFilter } from "../schemas/waffle";

export const WaffleRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  list(_filters: WaffleFilter) {
    return [{ waffle_id: "1", waffle_name: "asd" }];
  },

  create(waffle_data: WaffleCreateRequest) {
    return { waffle_id: "1", waffle_name: waffle_data.waffle_name };
  },
};
