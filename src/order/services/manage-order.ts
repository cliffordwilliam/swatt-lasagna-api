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
import { OrderItem } from "../entities/order-item.entity";
import { ITEM_REPOSITORY } from "../../item/repositories/item-repository";
import { MANAGE_PERSON } from "../../person/services/manage-person";
import {
  PersonCreateRequest,
  PersonUpdateRequest,
} from "../../person/schemas/person";
import { Item } from "../../item/entities/item.entity";

export const MANAGE_ORDER = {
  async list(em: EntityManager, filters: OrderFilter) {
    return await ORDER_REPOSITORY.list(em, filters);
  },

  async getById(em: EntityManager, orderId: number) {
    const order = await ORDER_REPOSITORY.getByIdOrFail(em, orderId);

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

  async create(em: EntityManager, orderData: OrderCreateRequest, flush = true) {
    const {
      items: orderItemValues,
      buyer,
      recipient,
      ...orderDataRest
    } = orderData;
    const order = new Order();
    assignSafe(orderDataRest, order);

    const itemMap = await this._getItemsMap(em, orderItemValues);

    let totalPurchase = 0;
    for (const orderItemValue of orderItemValues) {
      const item = itemMap[orderItemValue.itemId];
      totalPurchase += item.price * orderItemValue.quantity;
    }

    order.totalPurchase = totalPurchase;
    order.grandTotal = totalPurchase + orderData.shippingCost;

    order.buyer = await this._getPersonFromUpsert(em, buyer, false);
    order.recipient = await this._getPersonFromUpsert(em, recipient, false);

    em.persist(order);

    for (const orderItemValue of orderItemValues) {
      const item = itemMap[orderItemValue.itemId];

      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.item = item;
      orderItem.quantity = orderItemValue.quantity;
      em.persist(orderItem);
    }

    if (flush) {
      await em.flush();
    }

    await ORDER_REPOSITORY.populateRelations(em, order);

    const {
      buyer: buyerEntityPopulated,
      recipient: recipientEntityPopulated,
      orderItems: orderItemsCollection,
      ...orderRest
    } = order;

    return {
      ...orderRest,
      buyerId: buyerEntityPopulated.personId,
      recipientId: recipientEntityPopulated.personId,
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

    const {
      buyer: buyerValue,
      recipient: recipientValue,
      items: orderItemValues,
      ...orderDataRest
    } = updates;
    assignSafe(orderDataRest, existingOrder);

    if (orderItemValues) {
      em.remove(existingOrder.orderItems);

      const itemMap = await this._getItemsMap(em, orderItemValues);

      let totalPurchase = 0;
      for (const orderItemValue of orderItemValues) {
        const item = itemMap[orderItemValue.itemId];
        totalPurchase += item.price * orderItemValue.quantity;

        const orderItem = new OrderItem();
        orderItem.order = existingOrder;
        orderItem.item = item;
        orderItem.quantity = orderItemValue.quantity;
        em.persist(orderItem);
      }

      existingOrder.totalPurchase = totalPurchase;
    }

    existingOrder.grandTotal =
      existingOrder.totalPurchase + existingOrder.shippingCost;

    if (buyerValue) {
      existingOrder.buyer = await this._getPersonFromUpsert(
        em,
        buyerValue,
        false,
      );
    }

    if (recipientValue) {
      existingOrder.recipient = await this._getPersonFromUpsert(
        em,
        recipientValue,
        false,
      );
    }

    em.persist(existingOrder);

    if (flush) {
      await em.flush();
    }

    await ORDER_REPOSITORY.populateRelations(em, existingOrder);

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

  async _getPersonFromUpsert(
    em: EntityManager,
    personUpsert: PersonUpsertRequest,
    flush: boolean,
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

      return await MANAGE_PERSON.updatePersonEntity(
        em,
        updateRequest,
        personId,
        flush,
      );
    } else {
      const createRequest: PersonCreateRequest = {
        personName,
        phoneNumber: phone?.phoneNumber,
        address: address?.address,
      };

      return await MANAGE_PERSON.createPersonEntity(em, createRequest, flush);
    }
  },

  async _getItemsMap(em: EntityManager, orderItemValues: { itemId: number }[]) {
    const itemIds = orderItemValues.map(({ itemId }) => itemId);
    const items = await ITEM_REPOSITORY.getByIds(em, itemIds);
    const itemMap: Record<number, Item> = {};
    for (const item of items) {
      itemMap[item.itemId] = item;
    }
    return itemMap;
  },
};
