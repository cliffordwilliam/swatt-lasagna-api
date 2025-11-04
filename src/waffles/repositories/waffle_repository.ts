import { WaffleCreateRequest } from "../schemas/waffle";

export const WaffleRepository = {
    list() {
        return [{ waffle_id: "1", waffle_name: "asd"}];
    },

    create(waffle_data: WaffleCreateRequest) {
        return { waffle_id: "1", waffle_name: waffle_data.waffle_name };
    }
};
