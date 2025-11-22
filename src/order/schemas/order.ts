import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import { PersonCreateRequest } from "../../person/schemas/person";
import { PickupDeliveryEnum, PaymentEnum, OrderStatusEnum } from "./enums";

export const OrderItemResponse = z
  .object({
    itemId: z.int(),
    quantity: z.int(),
  })
  .meta({ id: "OrderItemResponse" });

export const Order = z
  .object({
    orderId: z.int(),
    po: z.string(),
    buyerId: z.int(),
    recipientId: z.int(),
    orderDate: z.date(),
    deliveryDate: z.date(),
    totalPurchase: z.int(),
    pickupDelivery: PickupDeliveryEnum,
    shippingCost: z.int(),
    grandTotal: z.int(),
    payment: PaymentEnum,
    orderStatus: OrderStatusEnum,
    note: z.string().nullable(),
    orderItems: z.array(OrderItemResponse),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({ id: "Order" });

export const PersonUpsertRequest = PersonCreateRequest.extend({
  personId: z.coerce.number().int().positive().optional(),
}).meta({ id: "PersonUpsertRequest" });
export type PersonUpsertRequest = z.infer<typeof PersonUpsertRequest>;

export const OrderItemRequest = z
  .object({
    itemId: z.coerce
      .number()
      .int()
      .positive("item ID is required and must be positive"),
    quantity: z.coerce
      .number()
      .int()
      .min(1, "quantity must be at least 1")
      .max(10000, "quantity is too large"),
  })
  .meta({ id: "OrderItemRequest" });
export type OrderItemRequest = z.infer<typeof OrderItemRequest>;

export const OrderCreateRequest = z
  .object({
    po: z
      .string()
      .min(1, "PO number is required")
      .max(255, "PO number is too long"),
    buyer: PersonUpsertRequest,
    recipient: PersonUpsertRequest,
    orderDate: z.iso.date(),
    deliveryDate: z.iso.date(),
    pickupDelivery: PickupDeliveryEnum,
    shippingCost: z.coerce
      .number()
      .int()
      .min(0, "shipping cost cannot be negative")
      .max(50_000_000, "shipping cost is too large"),
    payment: PaymentEnum,
    orderStatus: OrderStatusEnum,
    note: z.string().max(5000, "note is too long").optional(),
    items: z
      .array(OrderItemRequest)
      .min(1, "at least one item is required")
      .max(1000, "too many items"),
  })
  .meta({ id: "OrderCreateRequest" });
export type OrderCreateRequest = z.infer<typeof OrderCreateRequest>;

export const OrderCreateResponse = SuccessResponse(Order);
export type OrderCreateResponse = z.infer<typeof OrderCreateResponse>;
