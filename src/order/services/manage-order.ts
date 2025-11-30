import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import {
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderFilter,
  OrderItemRequest,
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
        itemName: oi.itemName,
        itemPrice: oi.itemPrice,
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

    const { totalPurchase, preparedItemMap } = await this._prepareOrderItems(
      em,
      orderItemValues,
    );

    order.totalPurchase = totalPurchase;
    order.grandTotal = totalPurchase + orderData.shippingCost;

    order.buyer = await this._getPersonFromUpsert(em, buyer, false);
    order.recipient = await this._getPersonFromUpsert(em, recipient, false);

    em.persist(order);

    for (const { item, quantity, itemName, itemPrice } of preparedItemMap) {
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.item = item;
      orderItem.quantity = quantity;
      orderItem.itemName = itemName;
      orderItem.itemPrice = itemPrice;
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
        itemName: oi.itemName,
        itemPrice: oi.itemPrice,
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

    let preparedItemMap: {
      item: Item;
      quantity: number;
      itemName: string;
      itemPrice: number;
    }[] = [];

    if (orderItemValues) {
      em.remove(existingOrder.orderItems);

      const { totalPurchase, preparedItemMap: givenPreparedItemMap } =
        await this._prepareOrderItems(em, orderItemValues);

      preparedItemMap = givenPreparedItemMap;

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

    if (orderItemValues) {
      for (const { item, quantity, itemName, itemPrice } of preparedItemMap) {
        const orderItem = new OrderItem();
        orderItem.order = existingOrder;
        orderItem.item = item;
        orderItem.quantity = quantity;
        orderItem.itemName = itemName;
        orderItem.itemPrice = itemPrice;
        em.persist(orderItem);
      }
    }

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
        itemName: oi.itemName,
        itemPrice: oi.itemPrice,
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

  async _prepareOrderItems(
    em: EntityManager,
    orderItemValues: OrderItemRequest[],
  ) {
    const itemIds = orderItemValues.map(({ itemId }) => itemId);
    const items = await ITEM_REPOSITORY.getByIds(em, itemIds);
    const preparedItemMap: {
      item: Item;
      quantity: number;
      itemName: string;
      itemPrice: number;
    }[] = [];
    let totalPurchase = 0;

    for (const item of items) {
      const orderItemValue = orderItemValues.find(
        (orderItem) => orderItem.itemId === item.itemId,
      );
      if (!orderItemValue) {
        throw new NotFoundError(
          `Quantity for item ${item.itemId} not provided`,
        );
      }
      const quantity = orderItemValue.quantity;
      const itemName = orderItemValue.itemName ?? item.itemName;
      const itemPrice = orderItemValue.itemPrice ?? item.price;

      preparedItemMap.push({
        item,
        quantity,
        itemName,
        itemPrice,
      });
      totalPurchase += itemPrice * quantity;
    }

    return { preparedItemMap, totalPurchase };
  },
};
