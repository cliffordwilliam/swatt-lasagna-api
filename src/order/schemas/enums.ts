import { z } from "zod";

export enum PickupDelivery {
  Pickup = "Pickup",
  Delivery = "Delivery",
  Gojek = "Gojek",
  Citytran = "Citytran",
  Paxel = "Paxel",
  Daytrans = "Daytrans",
  Baraya = "Baraya",
  Lintas = "Lintas",
  Bineka = "Bineka",
  Jne = "Jne",
}

export enum Payment {
  Tunai = "Tunai",
  KartuKredit = "Kartu Kredit",
  TransferBank = "Transfer Bank",
  QRIS = "QRIS",
}

export enum OrderStatus {
  Downpayment = "Downpayment",
  BelumBayar = "Belum bayar",
  Lunas = "Lunas",
}

export const PickupDeliveryEnum = z.enum([
  PickupDelivery.Pickup,
  PickupDelivery.Delivery,
  PickupDelivery.Gojek,
  PickupDelivery.Citytran,
  PickupDelivery.Paxel,
  PickupDelivery.Daytrans,
  PickupDelivery.Baraya,
  PickupDelivery.Lintas,
  PickupDelivery.Bineka,
  PickupDelivery.Jne,
]);

export const PaymentEnum = z.enum([
  Payment.Tunai,
  Payment.KartuKredit,
  Payment.TransferBank,
  Payment.QRIS,
]);

export const OrderStatusEnum = z.enum([
  OrderStatus.Downpayment,
  OrderStatus.BelumBayar,
  OrderStatus.Lunas,
]);
