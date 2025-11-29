import { MANAGE_ORDER } from "../../../src/order/services/manage-order";
import { ORDER_REPOSITORY } from "../../../src/order/repositories/order-repository";
import { ITEM_REPOSITORY } from "../../../src/item/repositories/item-repository";
import { MANAGE_PERSON } from "../../../src/person/services/manage-person";
import {
  OrderCreateRequest,
  OrderFilter,
  OrderUpdateRequest,
  PersonUpsertRequest,
} from "../../../src/order/schemas/order";
import {
  PickupDelivery,
  Payment,
  OrderStatus,
} from "../../../src/order/schemas/enums";
import { Order } from "../../../src/order/entities/order.entity";
import { Item } from "../../../src/item/entities/item.entity";
import { Person } from "../../../src/person/entities/person.entity";

jest.mock("../../../src/order/repositories/order-repository", () => ({
  ORDER_REPOSITORY: {
    list: jest.fn(),
    getByIdOrFail: jest.fn(),
    populateRelations: jest.fn(),
  },
}));

jest.mock("../../../src/item/repositories/item-repository", () => ({
  ITEM_REPOSITORY: {
    getByIds: jest.fn(),
  },
}));

jest.mock("../../../src/person/services/manage-person", () => ({
  MANAGE_PERSON: {
    createPersonEntity: jest.fn(),
    updatePersonEntity: jest.fn(),
  },
}));

describe("MANAGE_ORDER", () => {
  let mockEm: any;

  beforeEach(() => {
    mockEm = {
      persist: jest.fn(),
      flush: jest.fn(),
      remove: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("list", () => {
    it("delegates to ORDER_REPOSITORY.list", async () => {
      const filters: OrderFilter = {
        page: 1,
        pageSize: 25,
        sortField: "po",
        sortOrder: "asc",
        mode: "and",
      };

      const mockResult = { data: [], pagination: {} as any };
      (ORDER_REPOSITORY.list as jest.Mock).mockResolvedValue(mockResult);

      const result = await MANAGE_ORDER.list(mockEm, filters);

      expect(ORDER_REPOSITORY.list).toHaveBeenCalledWith(mockEm, filters);
      expect(result).toBe(mockResult);
    });
  });

  describe("getById", () => {
    it("returns normalized order payload", async () => {
      const orderItem = {
        item: { itemId: 7 },
        quantity: 3,
        itemName: "Test Item",
        itemPrice: 100,
      };
      const order = {
        orderId: 1,
        po: "PO-001",
        buyer: { personId: 10 },
        recipient: { personId: 20 },
        orderItems: new Set([orderItem]),
        totalPurchase: 100,
        grandTotal: 120,
        shippingCost: 20,
      } as unknown as Order;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(order);

      const result = await MANAGE_ORDER.getById(mockEm, 1);

      expect(ORDER_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(mockEm, 1);
      expect(result.buyerId).toBe(10);
      expect(result.recipientId).toBe(20);
      expect(result.orderItems).toEqual([
        { itemId: 7, quantity: 3, itemName: "Test Item", itemPrice: 100 },
      ]);
    });
  });

  describe("create", () => {
    it("persists order and items, recalculates totals, and normalizes response", async () => {
      const orderData: OrderCreateRequest = {
        po: "PO-100",
        orderDate: new Date(),
        deliveryDate: new Date(),
        pickupDelivery: PickupDelivery.Delivery,
        shippingCost: 15,
        payment: Payment.Tunai,
        orderStatus: OrderStatus.BelumBayar,
        note: "test",
        items: [
          { itemId: 1, quantity: 2 },
          { itemId: 2, quantity: 1 },
        ],
        buyer: { personName: "Buyer" },
        recipient: { personName: "Recipient" },
      };

      const buyerPerson = { personId: 101 } as Person;
      const recipientPerson = { personId: 202 } as Person;
      const itemOne = { itemId: 1, itemName: "Item One", price: 50 } as Item;
      const itemTwo = { itemId: 2, itemName: "Item Two", price: 40 } as Item;
      const preparedItems = {
        totalPurchase: 140,
        preparedItemMap: [
          { item: itemOne, quantity: 2, itemName: "Item One", itemPrice: 50 },
          { item: itemTwo, quantity: 1, itemName: "Item Two", itemPrice: 40 },
        ],
      };

      const prepareItemsSpy = jest
        .spyOn(MANAGE_ORDER as any, "_prepareOrderItems")
        .mockResolvedValue(preparedItems);
      const upsertSpy = jest
        .spyOn(MANAGE_ORDER as any, "_getPersonFromUpsert")
        .mockResolvedValueOnce(buyerPerson)
        .mockResolvedValueOnce(recipientPerson);
      (ORDER_REPOSITORY.populateRelations as jest.Mock).mockImplementation(
        async (_em, order: Order) => {
          order.buyer = buyerPerson;
          order.recipient = recipientPerson;
          order.orderItems = new Set([
            { item: itemOne, quantity: 2, itemName: "Item One", itemPrice: 50 },
            { item: itemTwo, quantity: 1, itemName: "Item Two", itemPrice: 40 },
          ]) as any;
        },
      );

      const result = await MANAGE_ORDER.create(mockEm, orderData);

      expect(prepareItemsSpy).toHaveBeenCalledWith(mockEm, orderData.items);
      expect(upsertSpy).toHaveBeenNthCalledWith(
        1,
        mockEm,
        orderData.buyer,
        false,
      );
      expect(upsertSpy).toHaveBeenNthCalledWith(
        2,
        mockEm,
        orderData.recipient,
        false,
      );
      expect(mockEm.persist).toHaveBeenCalledTimes(1 + orderData.items.length);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(ORDER_REPOSITORY.populateRelations).toHaveBeenCalled();
      expect(result.totalPurchase).toBe(140);
      expect(result.grandTotal).toBe(155);
      expect(result.orderItems).toEqual([
        { itemId: 1, quantity: 2, itemName: "Item One", itemPrice: 50 },
        { itemId: 2, quantity: 1, itemName: "Item Two", itemPrice: 40 },
      ]);
      expect(result.buyerId).toBe(101);
      expect(result.recipientId).toBe(202);
    });

    it("skips flush when flush flag is false", async () => {
      const orderData: OrderCreateRequest = {
        po: "PO-200",
        orderDate: new Date(),
        deliveryDate: new Date(),
        pickupDelivery: PickupDelivery.Pickup,
        shippingCost: 5,
        payment: Payment.QRIS,
        orderStatus: OrderStatus.Lunas,
        note: "no flush",
        items: [{ itemId: 1, quantity: 1 }],
        buyer: { personName: "Buyer" },
        recipient: { personName: "Recipient" },
      };

      const buyerPerson = { personId: 1 } as Person;
      const recipientPerson = { personId: 2 } as Person;

      const itemOne = { itemId: 1, itemName: "Item One", price: 25 } as Item;
      jest.spyOn(MANAGE_ORDER as any, "_prepareOrderItems").mockResolvedValue({
        totalPurchase: 25,
        preparedItemMap: [
          { item: itemOne, quantity: 1, itemName: "Item One", itemPrice: 25 },
        ],
      });
      jest
        .spyOn(MANAGE_ORDER as any, "_getPersonFromUpsert")
        .mockResolvedValueOnce(buyerPerson)
        .mockResolvedValueOnce(recipientPerson);
      (ORDER_REPOSITORY.populateRelations as jest.Mock).mockImplementation(
        async (_em, order: Order) => {
          order.buyer = buyerPerson;
          order.recipient = recipientPerson;
          order.orderItems = new Set([
            {
              item: { itemId: 1 },
              quantity: 1,
              itemName: "Item One",
              itemPrice: 25,
            },
          ]) as any;
        },
      );

      const result = await MANAGE_ORDER.create(mockEm, orderData, false);

      expect(mockEm.flush).not.toHaveBeenCalled();
      expect(result.orderItems).toEqual([
        { itemId: 1, quantity: 1, itemName: "Item One", itemPrice: 25 },
      ]);
    });
  });

  describe("update", () => {
    it("recomputes totals, replaces items, upserts people, and normalizes response", async () => {
      const orderId = 77;
      const existingOrder = {
        orderId,
        po: "PO-200",
        orderItems: [],
        shippingCost: 5,
        totalPurchase: 10,
        buyer: { personId: 1 },
        recipient: { personId: 2 },
      } as unknown as Order;
      const originalOrderItems = existingOrder.orderItems;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      (ORDER_REPOSITORY.populateRelations as jest.Mock).mockImplementation(
        async () => {
          existingOrder.orderItems = new Set([
            {
              item: { itemId: 9 },
              quantity: 4,
              itemName: "Item Nine",
              itemPrice: 25,
            },
          ]) as any;
        },
      );

      const buyerPerson = { personId: 300 } as Person;
      const recipientPerson = { personId: 400 } as Person;
      const itemNine = { itemId: 9, itemName: "Item Nine", price: 25 } as Item;
      jest.spyOn(MANAGE_ORDER as any, "_prepareOrderItems").mockResolvedValue({
        totalPurchase: 100,
        preparedItemMap: [
          { item: itemNine, quantity: 4, itemName: "Item Nine", itemPrice: 25 },
        ],
      });
      const upsertSpy = jest
        .spyOn(MANAGE_ORDER as any, "_getPersonFromUpsert")
        .mockResolvedValueOnce(buyerPerson)
        .mockResolvedValueOnce(recipientPerson);

      const updates: OrderUpdateRequest = {
        orderStatus: OrderStatus.Lunas,
        items: [{ itemId: 9, quantity: 4 }],
        buyer: { personName: "Updated Buyer" },
        recipient: { personName: "Updated Recipient" },
      };

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(ORDER_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        orderId,
      );
      expect(mockEm.remove).toHaveBeenCalledWith(originalOrderItems);
      expect(mockEm.persist).toHaveBeenCalledWith(existingOrder);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(upsertSpy).toHaveBeenNthCalledWith(
        1,
        mockEm,
        updates.buyer,
        false,
      );
      expect(upsertSpy).toHaveBeenNthCalledWith(
        2,
        mockEm,
        updates.recipient,
        false,
      );
      expect(existingOrder.totalPurchase).toBe(100);
      expect(existingOrder.grandTotal).toBe(105);
      expect(result.orderItems).toEqual([
        { itemId: 9, quantity: 4, itemName: "Item Nine", itemPrice: 25 },
      ]);
      expect(result.buyerId).toBe(300);
      expect(result.recipientId).toBe(400);
    });

    it("leaves items and people untouched when updates omit them and skips flush when false", async () => {
      const orderId = 88;
      const existingOrder = {
        orderId,
        po: "PO-300",
        orderItems: new Set([
          {
            item: { itemId: 5 },
            quantity: 2,
            itemName: "Item Five",
            itemPrice: 25,
          },
        ]) as any,
        totalPurchase: 50,
        shippingCost: 10,
        buyer: { personId: 5 },
        recipient: { personId: 6 },
      } as unknown as Order;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      (ORDER_REPOSITORY.populateRelations as jest.Mock).mockResolvedValue(
        undefined,
      );

      const updates: OrderUpdateRequest = {
        note: "only meta",
      };

      const upsertSpy = jest.spyOn(MANAGE_ORDER as any, "_getPersonFromUpsert");

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates, false);

      expect(mockEm.remove).not.toHaveBeenCalled();
      expect(mockEm.flush).not.toHaveBeenCalled();
      expect(upsertSpy).not.toHaveBeenCalled();
      expect(result.orderItems).toEqual([
        { itemId: 5, quantity: 2, itemName: "Item Five", itemPrice: 25 },
      ]);
    });
  });

  describe("_getPersonFromUpsert", () => {
    it("updates person when identifier provided", async () => {
      const upsert: PersonUpsertRequest = {
        personId: 1,
        personName: "Existing",
        phone: {
          phoneId: 10,
          phoneNumber: "555-5555",
          preferred: true,
        },
        address: {
          addressId: 20,
          address: "456 Main",
          preferred: false,
        },
      };

      const person = { personId: 1 } as Person;
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(person);

      const result = await (MANAGE_ORDER as any)._getPersonFromUpsert(
        mockEm,
        upsert,
        true,
      );

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "Existing",
          phone: {
            phoneId: 10,
            phoneNumber: "555-5555",
            preferred: true,
          },
          address: {
            addressId: 20,
            address: "456 Main",
            preferred: false,
          },
        },
        1,
        true,
      );
      expect(result).toBe(person);
    });

    it("creates person when identifier is missing", async () => {
      const upsert: PersonUpsertRequest = {
        personName: "New Person",
        phone: {
          phoneNumber: "333-4444",
          preferred: true,
        },
        address: {
          address: "123 Oak",
          preferred: false,
        },
      };

      const person = { personId: 99 } as Person;
      (MANAGE_PERSON.createPersonEntity as jest.Mock).mockResolvedValue(person);

      const result = await (MANAGE_ORDER as any)._getPersonFromUpsert(
        mockEm,
        upsert,
        false,
      );

      expect(MANAGE_PERSON.createPersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "New Person",
          phoneNumber: "333-4444",
          address: "123 Oak",
        },
        false,
      );
      expect(result).toBe(person);
    });

    it("updates person without phone or address payload", async () => {
      const upsert: PersonUpsertRequest = {
        personId: 5,
        personName: "Minimal",
      };

      const person = { personId: 5 } as Person;
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(person);

      const result = await (MANAGE_ORDER as any)._getPersonFromUpsert(
        mockEm,
        upsert,
        false,
      );

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "Minimal",
        },
        5,
        false,
      );
      expect(result).toBe(person);
    });
  });

  describe("_prepareOrderItems", () => {
    it("returns quantity-aware array and total purchase", async () => {
      const orderItemValues = [
        { itemId: 1, quantity: 2 },
        { itemId: 2, quantity: 1 },
      ];

      const itemOne = { itemId: 1, itemName: "Item One", price: 10 } as Item;
      const itemTwo = { itemId: 2, itemName: "Item Two", price: 20 } as Item;

      (ITEM_REPOSITORY.getByIds as jest.Mock).mockResolvedValue([
        itemOne,
        itemTwo,
      ]);

      const result = await (MANAGE_ORDER as any)._prepareOrderItems(
        mockEm,
        orderItemValues,
      );

      expect(ITEM_REPOSITORY.getByIds).toHaveBeenCalledWith(mockEm, [1, 2]);
      expect(result.totalPurchase).toBe(40);
      expect(result.preparedItemMap).toEqual([
        { item: itemOne, quantity: 2, itemName: "Item One", itemPrice: 10 },
        { item: itemTwo, quantity: 1, itemName: "Item Two", itemPrice: 20 },
      ]);
    });

    it("throws when quantity mapping is missing for returned item", async () => {
      const orderItemValues: any[] = [];
      const rogueItem = { itemId: 99, price: 5 } as Item;

      (ITEM_REPOSITORY.getByIds as jest.Mock).mockResolvedValue([rogueItem]);

      await expect(
        (MANAGE_ORDER as any)._prepareOrderItems(mockEm, orderItemValues),
      ).rejects.toThrow("Quantity for item 99 not provided");
    });
  });
});
