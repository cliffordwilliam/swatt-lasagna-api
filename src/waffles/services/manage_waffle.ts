import { WaffleRepository } from "../repositories/waffle_repository";
import { WaffleCreateRequest } from "../schemas/waffle"

export const ManageWaffle = {
    list() {
        return WaffleRepository.list();
    },

    create(waffle_data: WaffleCreateRequest) {
        return WaffleRepository.create(waffle_data);
    }
};
