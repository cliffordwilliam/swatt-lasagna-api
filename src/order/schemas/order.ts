import { z } from "zod";
import { SuccessResponse } from "../../api/schemas/api";
import {
  PaginationRequest,
  PaginationResponse,
} from "../../common/schemas/pagination-request";
import { SortOrderRequest } from "../../common/schemas/sort-order-request";
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

export const PersonUpsertRequest = z
  .object({
    personId: z.coerce.number().int().positive().optional(),
    personName: z
      .string()
      .min(1, "person name is required")
      .max(100, "person name is too long"),
    phone: z
      .object({
        phoneId: z.coerce.number().int().positive().optional(),
        phoneNumber: z
          .string()
          .min(1, "phone number is too short")
          .max(20, "phone number is too long"),
        preferred: z.boolean(),
      })
      .optional(),
    address: z
      .object({
        addressId: z.coerce.number().int().positive().optional(),
        address: z
          .string()
          .min(1, "address is too short")
          .max(500, "address is too long"),
        preferred: z.boolean(),
      })
      .optional(),
  })
  .meta({ id: "PersonUpsertRequest" });
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
    orderDate: z.coerce.date(),
    deliveryDate: z.coerce.date(),
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

export const OrderSortFieldRequest = z
  .object({
    sortField: z
      .enum(["po", "orderDate", "deliveryDate", "totalPurchase", "grandTotal"])
      .default("orderDate"),
  })
  .meta({ id: "OrderSortFieldRequest" });

export const OrderUpdateRequest = z
  .object({
    po: z
      .string()
      .min(1, "PO number is required")
      .max(255, "PO number is too long")
      .optional(),
    buyer: PersonUpsertRequest.optional(),
    recipient: PersonUpsertRequest.optional(),
    orderDate: z.coerce.date().optional(),
    deliveryDate: z.coerce.date().optional(),
    pickupDelivery: PickupDeliveryEnum.optional(),
    shippingCost: z.coerce
      .number()
      .int()
      .min(0, "shipping cost cannot be negative")
      .max(50_000_000, "shipping cost is too large")
      .optional(),
    payment: PaymentEnum.optional(),
    orderStatus: OrderStatusEnum.optional(),
    note: z.string().max(5000, "note is too long").optional(),
    items: z
      .array(OrderItemRequest)
      .min(1, "at least one item is required")
      .max(1000, "too many items")
      .optional(),
  })
  .meta({ id: "OrderUpdateRequest" });
export type OrderUpdateRequest = z.infer<typeof OrderUpdateRequest>;

export const OrderFilter = z
  .object({
    po: z.string().max(255, "PO number is too long").optional(),
    buyerId: z.coerce.number().int().positive().optional(),
    recipientId: z.coerce.number().int().positive().optional(),
    orderStatus: OrderStatusEnum.optional(),
    payment: PaymentEnum.optional(),
  })
  .extend(SortOrderRequest.shape)
  .extend(OrderSortFieldRequest.shape)
  .extend(PaginationRequest.shape)
  .meta({ id: "OrderFilter" });
export type OrderFilter = z.infer<typeof OrderFilter>;

export const OrderCreateResponse = SuccessResponse(Order);
export type OrderCreateResponse = z.infer<typeof OrderCreateResponse>;

export const OrderUpdateResponse = SuccessResponse(Order);
export type OrderUpdateResponse = z.infer<typeof OrderUpdateResponse>;

export const OrderGetResponse = SuccessResponse(Order);
export type OrderGetResponse = z.infer<typeof OrderGetResponse>;

export const OrderListResponse = SuccessResponse(
  z.array(Order),
  PaginationResponse,
);
export type OrderListResponse = z.infer<typeof OrderListResponse>;
