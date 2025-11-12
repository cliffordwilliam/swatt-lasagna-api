import { getEM } from "../../core/database/adapter";
import { PaymentEntity } from "../entities/payments.entity";

export const PaymentRepository = {
  async get_by_id_or_fail(id: number) {
    const em = await getEM();
    return em.findOneOrFail(PaymentEntity, { id });
  },
  async save(payment: PaymentEntity) {
    const em = await getEM();
    await em.persistAndFlush(payment);
    return payment;
  },
  async list() {
    const em = await getEM();
    const payments = await em.findAll(PaymentEntity);
    return {
      data: payments,
      pagination: {},
    };
  },
};
