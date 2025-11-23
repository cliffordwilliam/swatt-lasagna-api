import { EntityManager } from "@mikro-orm/postgresql";
import {
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderFilter,
  PersonUpsertRequest,
} from "../schemas/order";
import { Order } from "../entities/order.entity";
import { ORDER_REPOSITORY } from "../repositories/order-repository";
import { assignSafe } from "../../common/utils/assign-safe";
import { Person } from "../../person/entities/person.entity";
import { PERSON_REPOSITORY } from "../../person/repositories/person-repository";
import { OrderItem } from "../entities/order-item.entity";
import { ITEM_REPOSITORY } from "../../item/repositories/item-repository";
import { MANAGE_PERSON } from "../../person/services/manage-person";
import {
  PersonCreateRequest,
  PersonUpdateRequest,
} from "../../person/schemas/person";

export const MANAGE_ORDER = {
  async list(em: EntityManager, filters: OrderFilter) {
    return await ORDER_REPOSITORY.list(em, filters);
  },

  async getById(em: EntityManager, orderId: number) {
    const order = await ORDER_REPOSITORY.getByIdOrFail(em, orderId);
    await em.populate(order, [
      "buyer",
      "recipient",
      "orderItems",
      "orderItems.item",
    ]);

    const {
      buyer,
      recipient,
      orderItems: orderItemsCollection,
      ...orderRest
    } = order;

    return {
      ...orderRest,
      buyerId: buyer.personId,
      recipientId: recipient.personId,
      orderItems: Array.from(orderItemsCollection).map((oi) => ({
        itemId: oi.item.itemId,
        quantity: oi.quantity,
      })),
    };
  },

  async createPersonFromUpsert(
    em: EntityManager,
    personUpsert: PersonUpsertRequest,
  ): Promise<Person> {
    const { personId, personName, phone, address } = personUpsert;

    if (personId !== undefined) {
      const updateRequest: PersonUpdateRequest = {
        personName,
      };

      if (phone !== undefined) {
        updateRequest.phone = {
          phoneId: phone.phoneId,
          phoneNumber: phone.phoneNumber,
          preferred: phone.preferred,
        };
      }

      if (address !== undefined) {
        updateRequest.address = {
          addressId: address.addressId,
          address: address.address,
          preferred: address.preferred,
        };
      }

      await MANAGE_PERSON.update(em, updateRequest, personId, false);

      return await PERSON_REPOSITORY.getByIdOrFail(em, personId);
    } else {
      const createRequest: PersonCreateRequest = {
        personName,
        phoneNumber: phone?.phoneNumber,
        address: address?.address,
      };

      const createdPersonData = await MANAGE_PERSON.create(
        em,
        createRequest,
        true, // Always flush person creation to get ID
      );

      return await PERSON_REPOSITORY.getByIdOrFail(
        em,
        createdPersonData.personId,
      );
    }
  },

  async create(em: EntityManager, orderData: OrderCreateRequest, flush = true) {
    const {
      buyer: buyerValue,
      recipient: recipientValue,
      items: orderItemValues,
      ...orderDataRest
    } = orderData;

    let totalPurchase = 0;
    for (const orderItemValue of orderItemValues) {
      const item = await ITEM_REPOSITORY.getByIdOrFail(
        em,
        orderItemValue.itemId,
      );
      totalPurchase += item.price * orderItemValue.quantity;
    }

    const order = new Order();
    assignSafe(orderDataRest, order);
    order.totalPurchase = totalPurchase;
    order.grandTotal = totalPurchase + orderDataRest.shippingCost;
    order.buyer = await this.createPersonFromUpsert(em, buyerValue);
    order.recipient = await this.createPersonFromUpsert(em, recipientValue);

    const createdOrder = await ORDER_REPOSITORY.save(em, order);

    const orderItems: OrderItem[] = [];
    for (const orderItemValue of orderItemValues) {
      const item = await ITEM_REPOSITORY.getByIdOrFail(
        em,
        orderItemValue.itemId,
      );

      const orderItem = new OrderItem();
      orderItem.order = createdOrder;
      orderItem.item = item;
      orderItem.quantity = orderItemValue.quantity;

      em.persist(orderItem);
      orderItems.push(orderItem);
    }

    if (flush) {
      await em.flush();
    }

    await em.populate(createdOrder, [
      "buyer",
      "recipient",
      "orderItems",
      "orderItems.item",
    ]);

    const {
      buyer: buyerEntity,
      recipient: recipientEntity,
      orderItems: orderItemsCollection,
      ...orderRest
    } = createdOrder;

    return {
      ...orderRest,
      buyerId: buyerEntity.personId,
      recipientId: recipientEntity.personId,
      orderItems: Array.from(orderItemsCollection).map((oi) => ({
        itemId: oi.item.itemId,
        quantity: oi.quantity,
      })),
    };
  },

  async update(
    em: EntityManager,
    orderId: number,
    updates: OrderUpdateRequest,
    flush = true,
  ) {
    const existingOrder = await ORDER_REPOSITORY.getByIdOrFail(em, orderId);
    await em.populate(existingOrder, [
      "buyer",
      "recipient",
      "orderItems",
      "orderItems.item",
    ]);

    const {
      buyer: buyerValue,
      recipient: recipientValue,
      items: orderItemValues,
      ...orderDataRest
    } = updates;

    if (buyerValue !== undefined) {
      const newBuyer = await this.createPersonFromUpsert(em, buyerValue);
      existingOrder.buyer = newBuyer;
    }

    if (recipientValue !== undefined) {
      const newRecipient = await this.createPersonFromUpsert(
        em,
        recipientValue,
      );
      existingOrder.recipient = newRecipient;
    }

    if (orderItemValues !== undefined) {
      const existingOrderItems = Array.from(existingOrder.orderItems);
      for (const orderItem of existingOrderItems) {
        em.remove(orderItem);
      }

      let totalPurchase = 0;
      for (const orderItemValue of orderItemValues) {
        const item = await ITEM_REPOSITORY.getByIdOrFail(
          em,
          orderItemValue.itemId,
        );
        totalPurchase += item.price * orderItemValue.quantity;
      }

      for (const orderItemValue of orderItemValues) {
        const item = await ITEM_REPOSITORY.getByIdOrFail(
          em,
          orderItemValue.itemId,
        );

        const orderItem = new OrderItem();
        orderItem.order = existingOrder;
        orderItem.item = item;
        orderItem.quantity = orderItemValue.quantity;

        em.persist(orderItem);
      }

      existingOrder.totalPurchase = totalPurchase;
    }

    assignSafe(orderDataRest, existingOrder);

    if (
      orderDataRest.shippingCost !== undefined ||
      orderItemValues !== undefined
    ) {
      existingOrder.grandTotal =
        existingOrder.totalPurchase + existingOrder.shippingCost;
    }

    await ORDER_REPOSITORY.save(em, existingOrder);

    if (flush) {
      await em.flush();
    }

    await em.populate(existingOrder, [
      "buyer",
      "recipient",
      "orderItems",
      "orderItems.item",
    ]);

    const {
      buyer: buyerEntity,
      recipient: recipientEntity,
      orderItems: orderItemsCollection,
      ...orderRest
    } = existingOrder;

    return {
      ...orderRest,
      buyerId: buyerEntity.personId,
      recipientId: recipientEntity.personId,
      orderItems: Array.from(orderItemsCollection).map((oi) => ({
        itemId: oi.item.itemId,
        quantity: oi.quantity,
      })),
    };
  },
};
