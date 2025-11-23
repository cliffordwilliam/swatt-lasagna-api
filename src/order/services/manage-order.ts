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
import { PersonPhone } from "../../person-phone/entities/person-phone.entity";
import { PersonAddress } from "../../person-address/entities/person-address.entity";
import { PERSON_PHONE_REPOSITORY } from "../../person-phone/repositories/person-phone-repository";
import { PERSON_ADDRESS_REPOSITORY } from "../../person-address/repositories/person-address-repository";

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

  dtoToEntities(dto: OrderCreateRequest): {
    buyerPerson: Person | null;
    buyerPhone: PersonPhone | null;
    buyerAddress: PersonAddress | null;
    recipientPerson: Person | null;
    recipientPhone: PersonPhone | null;
    recipientAddress: PersonAddress | null;
    order: Order;
    orderItems: { orderItem: OrderItem; itemId: number }[];
  } {
    const {
      buyer: buyerValue,
      recipient: recipientValue,
      items: orderItemValues,
      ...orderDataRest
    } = dto;

    let buyerPerson: Person | null = null;
    let buyerPhone: PersonPhone | null = null;
    let buyerAddress: PersonAddress | null = null;

    if (buyerValue.personId === undefined) {
      const {
        phone: buyerPhoneValue,
        address: buyerAddressValue,
        ...buyerPersonData
      } = {
        personName: buyerValue.personName,
        phone: buyerValue.phone,
        address: buyerValue.address,
      };

      buyerPerson = new Person();
      buyerPerson.personName = buyerPersonData.personName;

      if (buyerPhoneValue) {
        buyerPhone = new PersonPhone();
        buyerPhone.phoneNumber = buyerPhoneValue.phoneNumber;
        buyerPhone.preferred = buyerPhoneValue.preferred;
      }

      if (buyerAddressValue) {
        buyerAddress = new PersonAddress();
        buyerAddress.address = buyerAddressValue.address;
        buyerAddress.preferred = buyerAddressValue.preferred;
      }
    }

    let recipientPerson: Person | null = null;
    let recipientPhone: PersonPhone | null = null;
    let recipientAddress: PersonAddress | null = null;

    if (recipientValue.personId === undefined) {
      const {
        phone: recipientPhoneValue,
        address: recipientAddressValue,
        ...recipientPersonData
      } = {
        personName: recipientValue.personName,
        phone: recipientValue.phone,
        address: recipientValue.address,
      };

      recipientPerson = new Person();
      recipientPerson.personName = recipientPersonData.personName;

      if (recipientPhoneValue) {
        recipientPhone = new PersonPhone();
        recipientPhone.phoneNumber = recipientPhoneValue.phoneNumber;
        recipientPhone.preferred = recipientPhoneValue.preferred;
      }

      if (recipientAddressValue) {
        recipientAddress = new PersonAddress();
        recipientAddress.address = recipientAddressValue.address;
        recipientAddress.preferred = recipientAddressValue.preferred;
      }
    }

    const order = new Order();
    assignSafe(orderDataRest, order);

    const orderItems = orderItemValues.map((orderItemValue) => {
      const orderItem = new OrderItem();
      orderItem.quantity = orderItemValue.quantity;
      return { orderItem, itemId: orderItemValue.itemId };
    });

    return {
      buyerPerson,
      buyerPhone,
      buyerAddress,
      recipientPerson,
      recipientPhone,
      recipientAddress,
      order,
      orderItems,
    };
  },

  async getPersonFromUpsert(
    em: EntityManager,
    personUpsert: PersonUpsertRequest,
    flush = true,
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

  async create(em: EntityManager, orderData: OrderCreateRequest, flush = true) {
    const {
      buyerPerson,
      buyerPhone,
      buyerAddress,
      recipientPerson,
      recipientPhone,
      recipientAddress,
      order,
      orderItems: orderItemData,
    } = this.dtoToEntities(orderData);

    let totalPurchase = 0;
    for (const { itemId, orderItem } of orderItemData) {
      const item = await ITEM_REPOSITORY.getByIdOrFail(em, itemId);
      totalPurchase += item.price * orderItem.quantity;
    }

    order.totalPurchase = totalPurchase;
    order.grandTotal = totalPurchase + orderData.shippingCost;

    let buyer: Person;
    if (buyerPerson) {
      const createdBuyer = await PERSON_REPOSITORY.save(em, buyerPerson);

      if (buyerPhone) {
        buyerPhone.person = createdBuyer;
        await PERSON_PHONE_REPOSITORY.save(em, buyerPhone, createdBuyer);
      }

      if (buyerAddress) {
        buyerAddress.person = createdBuyer;
        await PERSON_ADDRESS_REPOSITORY.save(em, buyerAddress, createdBuyer);
      }

      buyer = createdBuyer;
    } else {
      buyer = await this.getPersonFromUpsert(em, orderData.buyer, false);
    }

    let recipient: Person;
    if (recipientPerson) {
      const createdRecipient = await PERSON_REPOSITORY.save(
        em,
        recipientPerson,
      );

      if (recipientPhone) {
        recipientPhone.person = createdRecipient;
        await PERSON_PHONE_REPOSITORY.save(
          em,
          recipientPhone,
          createdRecipient,
        );
      }

      if (recipientAddress) {
        recipientAddress.person = createdRecipient;
        await PERSON_ADDRESS_REPOSITORY.save(
          em,
          recipientAddress,
          createdRecipient,
        );
      }

      recipient = createdRecipient;
    } else {
      recipient = await this.getPersonFromUpsert(
        em,
        orderData.recipient,
        false,
      );
    }

    order.buyer = buyer;
    order.recipient = recipient;

    const createdOrder = await ORDER_REPOSITORY.save(em, order);

    for (const { orderItem, itemId } of orderItemData) {
      const item = await ITEM_REPOSITORY.getByIdOrFail(em, itemId);
      orderItem.order = createdOrder;
      orderItem.item = item;
      em.persist(orderItem);
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

    if (buyerValue) {
      const newBuyer = await this.getPersonFromUpsert(em, buyerValue, false);
      existingOrder.buyer = newBuyer;
    }

    if (recipientValue) {
      const newRecipient = await this.getPersonFromUpsert(
        em,
        recipientValue,
        false,
      );
      existingOrder.recipient = newRecipient;
    }

    if (orderItemValues) {
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

    existingOrder.grandTotal =
      existingOrder.totalPurchase + existingOrder.shippingCost;

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
