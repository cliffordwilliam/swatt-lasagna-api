import { WaffleCreateRequest } from "../schemas/waffle";

export const WaffleRepository = {
    create(waffle_data: WaffleCreateRequest) {
        return { id: "1", name: waffle_data.waffle_name };
    }
};
