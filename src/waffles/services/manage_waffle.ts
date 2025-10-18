import { WaffleRepository } from "../repositories/waffle_repository";
import { WaffleCreateRequest } from "../schemas/waffle"

export const ManageWaffle = {
    create(waffle_data: WaffleCreateRequest) {
        return WaffleRepository.create(waffle_data);
    }
};
