import { Order } from "../../../src/order/entities/order.entity";
import { ORDER_REPOSITORY } from "../../../src/order/repositories/order-repository";
import { MANAGE_ORDER } from "../../../src/order/services/manage-order";
import {
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderFilter,
} from "../../../src/order/schemas/order";
import { Person } from "../../../src/person/entities/person.entity";
import { PERSON_REPOSITORY } from "../../../src/person/repositories/person-repository";
import { MANAGE_PERSON } from "../../../src/person/services/manage-person";
import { ITEM_REPOSITORY } from "../../../src/item/repositories/item-repository";
import { Item } from "../../../src/item/entities/item.entity";
import { OrderItem } from "../../../src/order/entities/order-item.entity";
import {
  PickupDelivery,
  Payment,
  OrderStatus,
} from "../../../src/order/schemas/enums";

jest.mock("../../../src/order/repositories/order-repository", () => ({
  ORDER_REPOSITORY: {
    list: jest.fn(),
    getByIdOrFail: jest.fn(),
    save: jest.fn(),
  },
}));

jest.mock("../../../src/person/repositories/person-repository", () => ({
  PERSON_REPOSITORY: {
    getByIdOrFail: jest.fn(),
    save: jest.fn(),
  },
}));

jest.mock("../../../src/person/services/manage-person", () => ({
  MANAGE_PERSON: {
    create: jest.fn(),
    update: jest.fn(),
    createPersonEntity: jest.fn(),
    updatePersonEntity: jest.fn(),
  },
}));

jest.mock("../../../src/item/repositories/item-repository", () => ({
  ITEM_REPOSITORY: {
    getByIdOrFail: jest.fn(),
  },
}));

const mockEm = {
  flush: jest.fn(),
  populate: jest.fn(),
  persist: jest.fn(),
  remove: jest.fn(),
  nativeUpdate: jest.fn(),
} as any;

describe("MANAGE_ORDER", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should call ORDER_REPOSITORY.list with filters", async () => {
      const filters: OrderFilter = {
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockResult = {
        data: [new Order()],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      (ORDER_REPOSITORY.list as jest.Mock).mockResolvedValue(mockResult);

      const result = await MANAGE_ORDER.list(mockEm, filters);

      expect(ORDER_REPOSITORY.list).toHaveBeenCalledWith(mockEm, filters);
      expect(result).toBe(mockResult);
    });
  });

  describe("getById", () => {
    it("should get an order by id and transform the response", async () => {
      const orderId = 1;
      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      mockBuyer.personName = "Buyer";

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      mockRecipient.personName = "Recipient";

      const mockItem = new Item();
      mockItem.itemId = 1;
      mockItem.itemName = "Test Item";
      mockItem.price = 100;

      const mockOrderItem = new OrderItem();
      mockOrderItem.item = mockItem;
      mockOrderItem.quantity = 2;

      const mockOrder = new Order();
      mockOrder.orderId = orderId;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [mockOrderItem] as any;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.getById(mockEm, orderId);

      expect(ORDER_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        orderId,
      );
      expect(mockEm.populate).toHaveBeenCalledWith(mockOrder, [
        "buyer",
        "recipient",
        "orderItems",
        "orderItems.item",
      ]);
      expect(result.orderId).toBe(orderId);
      expect(result.buyerId).toBe(1);
      expect(result.recipientId).toBe(2);
      expect(result.orderItems).toHaveLength(1);
      expect(result.orderItems[0].itemId).toBe(1);
      expect(result.orderItems[0].quantity).toBe(2);
    });
  });

  describe("create", () => {
    it("should create a new order with provided data", async () => {
      const orderData: OrderCreateRequest = {
        po: "PO-001",
        buyer: {
          personName: "Buyer",
          phone: {
            phoneNumber: "555-1234",
            preferred: true,
          },
        },
        recipient: {
          personName: "Recipient",
          address: {
            address: "123 Test St",
            preferred: true,
          },
        },
        orderDate: new Date("2024-01-01"),
        deliveryDate: new Date("2024-01-02"),
        pickupDelivery: PickupDelivery.Pickup,
        shippingCost: 3000,
        payment: Payment.Tunai,
        orderStatus: OrderStatus.BelumBayar,
        items: [
          { itemId: 1, quantity: 2 },
          { itemId: 2, quantity: 1 },
        ],
      };

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      mockBuyer.personName = "Buyer";

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      mockRecipient.personName = "Recipient";

      const item1 = new Item();
      item1.itemId = 1;
      item1.price = 100;

      const item2 = new Item();
      item2.itemId = 2;
      item2.price = 200;

      const orderItem1 = new OrderItem();
      orderItem1.item = item1;
      orderItem1.quantity = 2;

      const orderItem2 = new OrderItem();
      orderItem2.item = item2;
      orderItem2.quantity = 1;

      const createdOrder = new Order();
      createdOrder.orderId = 1;
      createdOrder.po = "PO-001";
      createdOrder.buyer = mockBuyer;
      createdOrder.recipient = mockRecipient;
      createdOrder.totalPurchase = 400;
      createdOrder.grandTotal = 3400;
      createdOrder.orderItems = [orderItem1, orderItem2] as any;

      (PERSON_REPOSITORY.save as jest.Mock)
        .mockResolvedValueOnce(mockBuyer)
        .mockResolvedValueOnce(mockRecipient);
      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock)
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item2)
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item2);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(createdOrder);
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.create(mockEm, orderData);

      // Called once for buyer person, once for recipient person
      expect(PERSON_REPOSITORY.save).toHaveBeenCalledTimes(2);
      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledTimes(4);
      expect(ORDER_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Order),
      );
      // Called for: buyer phone (1), recipient address (1), order items (2) = 4 total
      expect(mockEm.persist).toHaveBeenCalledTimes(4);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.orderId).toBe(1);
      expect(result.buyerId).toBe(1);
      expect(result.recipientId).toBe(2);
      expect(result.orderItems).toHaveLength(2);
      expect(result.orderItems[0].itemId).toBe(1);
      expect(result.orderItems[0].quantity).toBe(2);
      expect(result.orderItems[1].itemId).toBe(2);
      expect(result.orderItems[1].quantity).toBe(1);
    });

    it("should not flush when flush parameter is false", async () => {
      const orderData: OrderCreateRequest = {
        po: "PO-001",
        buyer: {
          personName: "Buyer",
        },
        recipient: {
          personName: "Recipient",
        },
        orderDate: new Date("2024-01-01"),
        deliveryDate: new Date("2024-01-02"),
        pickupDelivery: PickupDelivery.Pickup,
        shippingCost: 3000,
        payment: Payment.Tunai,
        orderStatus: OrderStatus.BelumBayar,
        items: [{ itemId: 1, quantity: 1 }],
      };

      const mockBuyer = new Person();
      mockBuyer.personId = 1;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;

      const item1 = new Item();
      item1.itemId = 1;
      item1.price = 100;

      const createdOrder = new Order();
      createdOrder.orderId = 1;
      createdOrder.buyer = mockBuyer;
      createdOrder.recipient = mockRecipient;
      createdOrder.orderItems = [] as any;

      (PERSON_REPOSITORY.save as jest.Mock)
        .mockResolvedValueOnce(mockBuyer)
        .mockResolvedValueOnce(mockRecipient);
      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock)
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item1);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(createdOrder);
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      await MANAGE_ORDER.create(mockEm, orderData, false);

      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it("should create order with buyer having address but no phone", async () => {
      const orderData: OrderCreateRequest = {
        po: "PO-002",
        buyer: {
          personName: "Buyer",
          address: {
            address: "123 Test St",
            preferred: true,
          },
        },
        recipient: {
          personName: "Recipient",
        },
        orderDate: new Date("2024-01-01"),
        deliveryDate: new Date("2024-01-02"),
        pickupDelivery: PickupDelivery.Pickup,
        shippingCost: 1000,
        payment: Payment.Tunai,
        orderStatus: OrderStatus.BelumBayar,
        items: [{ itemId: 1, quantity: 1 }],
      };

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      const item1 = new Item();
      item1.itemId = 1;
      item1.price = 100;

      const createdOrder = new Order();
      createdOrder.orderId = 1;
      createdOrder.buyer = mockBuyer;
      createdOrder.recipient = mockRecipient;
      createdOrder.orderItems = [] as any;

      (PERSON_REPOSITORY.save as jest.Mock)
        .mockResolvedValueOnce(mockBuyer)
        .mockResolvedValueOnce(mockRecipient);
      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock)
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item1);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(createdOrder);
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      await MANAGE_ORDER.create(mockEm, orderData);

      expect(PERSON_REPOSITORY.save).toHaveBeenCalledTimes(2);
      // buyer address (1) + order item (1) = 2
      expect(mockEm.persist).toHaveBeenCalledTimes(2);
    });

    it("should create order with recipient having phone but no address", async () => {
      const orderData: OrderCreateRequest = {
        po: "PO-003",
        buyer: {
          personName: "Buyer",
        },
        recipient: {
          personName: "Recipient",
          phone: {
            phoneNumber: "555-5678",
            preferred: true,
          },
        },
        orderDate: new Date("2024-01-01"),
        deliveryDate: new Date("2024-01-02"),
        pickupDelivery: PickupDelivery.Pickup,
        shippingCost: 1000,
        payment: Payment.Tunai,
        orderStatus: OrderStatus.BelumBayar,
        items: [{ itemId: 1, quantity: 1 }],
      };

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      const item1 = new Item();
      item1.itemId = 1;
      item1.price = 100;

      const createdOrder = new Order();
      createdOrder.orderId = 1;
      createdOrder.buyer = mockBuyer;
      createdOrder.recipient = mockRecipient;
      createdOrder.orderItems = [] as any;

      (PERSON_REPOSITORY.save as jest.Mock)
        .mockResolvedValueOnce(mockBuyer)
        .mockResolvedValueOnce(mockRecipient);
      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock)
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item1);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(createdOrder);
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      await MANAGE_ORDER.create(mockEm, orderData);

      expect(PERSON_REPOSITORY.save).toHaveBeenCalledTimes(2);
      // recipient phone (1) + order item (1) = 2
      expect(mockEm.persist).toHaveBeenCalledTimes(2);
    });

    it("should create order with existing buyer and recipient (personId provided)", async () => {
      const orderData: OrderCreateRequest = {
        po: "PO-004",
        buyer: {
          personId: 1,
          personName: "Existing Buyer",
        },
        recipient: {
          personId: 2,
          personName: "Existing Recipient",
        },
        orderDate: new Date("2024-01-01"),
        deliveryDate: new Date("2024-01-02"),
        pickupDelivery: PickupDelivery.Pickup,
        shippingCost: 1000,
        payment: Payment.Tunai,
        orderStatus: OrderStatus.BelumBayar,
        items: [{ itemId: 1, quantity: 1 }],
      };

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      const item1 = new Item();
      item1.itemId = 1;
      item1.price = 100;

      const createdOrder = new Order();
      createdOrder.orderId = 1;
      createdOrder.buyer = mockBuyer;
      createdOrder.recipient = mockRecipient;
      createdOrder.orderItems = [] as any;

      (MANAGE_PERSON.updatePersonEntity as jest.Mock)
        .mockResolvedValueOnce(mockBuyer)
        .mockResolvedValueOnce(mockRecipient);
      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock)
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item1);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(createdOrder);
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      await MANAGE_ORDER.create(mockEm, orderData);

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledTimes(2);
      expect(PERSON_REPOSITORY.save).not.toHaveBeenCalled();
      // order item (1) = 1
      expect(mockEm.persist).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update an existing order with provided updates", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        po: "PO-002",
        shippingCost: 5000,
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(ORDER_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        orderId,
      );
      expect(ORDER_REPOSITORY.save).toHaveBeenCalledWith(mockEm, existingOrder);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.po).toBe("PO-002");
      expect(result.shippingCost).toBe(5000);
    });

    it("should update buyer when provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        buyer: {
          personId: 1,
          personName: "Updated Buyer",
          phone: {
            phoneNumber: "555-9999",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const oldBuyer = new Person();
      oldBuyer.personId = 1;
      existingOrder.buyer = oldBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      const newBuyer = new Person();
      newBuyer.personId = 1;
      newBuyer.personName = "Updated Buyer";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(
        newBuyer,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.objectContaining({
          personName: "Updated Buyer",
          phone: {
            phoneId: undefined,
            phoneNumber: "555-9999",
            preferred: true,
          },
        }),
        1,
        false,
      );
      expect(result.buyerId).toBe(1);
    });

    it("should update buyer with personId but without phone or address", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        buyer: {
          personId: 1,
          personName: "Updated Buyer",
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const oldBuyer = new Person();
      oldBuyer.personId = 1;
      existingOrder.buyer = oldBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      const newBuyer = new Person();
      newBuyer.personId = 1;
      newBuyer.personName = "Updated Buyer";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(
        newBuyer,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.objectContaining({
          personName: "Updated Buyer",
        }),
        1,
        false,
      );
      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.not.objectContaining({
          phone: expect.anything(),
          address: expect.anything(),
        }),
        1,
        false,
      );
      expect(result.buyerId).toBe(1);
    });

    it("should update buyer with personId and address but without phone", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        buyer: {
          personId: 1,
          personName: "Updated Buyer",
          address: {
            address: "123 Test St",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const oldBuyer = new Person();
      oldBuyer.personId = 1;
      existingOrder.buyer = oldBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      const newBuyer = new Person();
      newBuyer.personId = 1;
      newBuyer.personName = "Updated Buyer";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(
        newBuyer,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.objectContaining({
          personName: "Updated Buyer",
          address: {
            addressId: undefined,
            address: "123 Test St",
            preferred: true,
          },
        }),
        1,
        false,
      );
      expect(result.buyerId).toBe(1);
    });

    it("should update buyer with personId, phone, and address all provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        buyer: {
          personId: 1,
          personName: "Updated Buyer",
          phone: {
            phoneId: 10,
            phoneNumber: "555-9999",
            preferred: true,
          },
          address: {
            addressId: 20,
            address: "123 Test St",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const oldBuyer = new Person();
      oldBuyer.personId = 1;
      existingOrder.buyer = oldBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      const newBuyer = new Person();
      newBuyer.personId = 1;
      newBuyer.personName = "Updated Buyer";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(
        newBuyer,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.objectContaining({
          personName: "Updated Buyer",
          phone: {
            phoneId: 10,
            phoneNumber: "555-9999",
            preferred: true,
          },
          address: {
            addressId: 20,
            address: "123 Test St",
            preferred: true,
          },
        }),
        1,
        false,
      );
      expect(result.buyerId).toBe(1);
    });

    it("should create new buyer when personId is not provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        buyer: {
          personName: "New Buyer",
          phone: {
            phoneNumber: "555-1111",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const oldBuyer = new Person();
      oldBuyer.personId = 1;
      existingOrder.buyer = oldBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      const newBuyer = new Person();
      newBuyer.personId = 3;
      newBuyer.personName = "New Buyer";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.createPersonEntity as jest.Mock).mockResolvedValue(
        newBuyer,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.createPersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "New Buyer",
          phoneNumber: "555-1111",
          address: undefined,
        },
        false,
      );
      expect(result.buyerId).toBe(3);
    });

    it("should create new buyer without phone or address when personId is not provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        buyer: {
          personName: "New Buyer",
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const oldBuyer = new Person();
      oldBuyer.personId = 1;
      existingOrder.buyer = oldBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      const newBuyer = new Person();
      newBuyer.personId = 3;
      newBuyer.personName = "New Buyer";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.createPersonEntity as jest.Mock).mockResolvedValue(
        newBuyer,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.createPersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "New Buyer",
          phoneNumber: undefined,
          address: undefined,
        },
        false,
      );
      expect(result.buyerId).toBe(3);
    });

    it("should create new buyer with address but without phone when personId is not provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        buyer: {
          personName: "New Buyer",
          address: {
            address: "456 New St",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const oldBuyer = new Person();
      oldBuyer.personId = 1;
      existingOrder.buyer = oldBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      const newBuyer = new Person();
      newBuyer.personId = 3;
      newBuyer.personName = "New Buyer";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.createPersonEntity as jest.Mock).mockResolvedValue(
        newBuyer,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.createPersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "New Buyer",
          phoneNumber: undefined,
          address: "456 New St",
        },
        false,
      );
      expect(result.buyerId).toBe(3);
    });

    it("should create new buyer with both phone and address when personId is not provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        buyer: {
          personName: "New Buyer",
          phone: {
            phoneNumber: "555-1111",
            preferred: true,
          },
          address: {
            address: "456 New St",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const oldBuyer = new Person();
      oldBuyer.personId = 1;
      existingOrder.buyer = oldBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      const newBuyer = new Person();
      newBuyer.personId = 3;
      newBuyer.personName = "New Buyer";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.createPersonEntity as jest.Mock).mockResolvedValue(
        newBuyer,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.createPersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "New Buyer",
          phoneNumber: "555-1111",
          address: "456 New St",
        },
        false,
      );
      expect(result.buyerId).toBe(3);
    });

    it("should update recipient when provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        recipient: {
          personId: 2,
          personName: "Updated Recipient",
          address: {
            address: "456 New St",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const oldRecipient = new Person();
      oldRecipient.personId = 2;
      existingOrder.recipient = oldRecipient;

      existingOrder.orderItems = [] as any;

      const newRecipient = new Person();
      newRecipient.personId = 2;
      newRecipient.personName = "Updated Recipient";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(
        newRecipient,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.objectContaining({
          personName: "Updated Recipient",
          address: {
            addressId: undefined,
            address: "456 New St",
            preferred: true,
          },
        }),
        2,
        false,
      );
      expect(result.recipientId).toBe(2);
    });

    it("should update recipient with personId but without phone or address", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        recipient: {
          personId: 2,
          personName: "Updated Recipient",
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const oldRecipient = new Person();
      oldRecipient.personId = 2;
      existingOrder.recipient = oldRecipient;

      existingOrder.orderItems = [] as any;

      const newRecipient = new Person();
      newRecipient.personId = 2;
      newRecipient.personName = "Updated Recipient";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(
        newRecipient,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.objectContaining({
          personName: "Updated Recipient",
        }),
        2,
        false,
      );
      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.not.objectContaining({
          phone: expect.anything(),
          address: expect.anything(),
        }),
        2,
        false,
      );
      expect(result.recipientId).toBe(2);
    });

    it("should update recipient with personId, phone, and address all provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        recipient: {
          personId: 2,
          personName: "Updated Recipient",
          phone: {
            phoneId: 10,
            phoneNumber: "555-8888",
            preferred: true,
          },
          address: {
            addressId: 20,
            address: "789 Updated St",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const oldRecipient = new Person();
      oldRecipient.personId = 2;
      existingOrder.recipient = oldRecipient;

      existingOrder.orderItems = [] as any;

      const newRecipient = new Person();
      newRecipient.personId = 2;
      newRecipient.personName = "Updated Recipient";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(
        newRecipient,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.objectContaining({
          personName: "Updated Recipient",
          phone: {
            phoneId: 10,
            phoneNumber: "555-8888",
            preferred: true,
          },
          address: {
            addressId: 20,
            address: "789 Updated St",
            preferred: true,
          },
        }),
        2,
        false,
      );
      expect(result.recipientId).toBe(2);
    });

    it("should create new recipient when personId is not provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        recipient: {
          personName: "New Recipient",
          phone: {
            phoneNumber: "555-2222",
            preferred: true,
          },
        },
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const oldRecipient = new Person();
      oldRecipient.personId = 2;
      existingOrder.recipient = oldRecipient;

      existingOrder.orderItems = [] as any;

      const newRecipient = new Person();
      newRecipient.personId = 4;
      newRecipient.personName = "New Recipient";

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (MANAGE_PERSON.createPersonEntity as jest.Mock).mockResolvedValue(
        newRecipient,
      );
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(MANAGE_PERSON.createPersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "New Recipient",
          phoneNumber: "555-2222",
          address: undefined,
        },
        false,
      );
      expect(result.recipientId).toBe(4);
    });

    it("should update order items when provided", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        items: [
          { itemId: 1, quantity: 3 },
          { itemId: 2, quantity: 2 },
        ],
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      const oldOrderItem = new OrderItem();
      oldOrderItem.item = new Item();
      oldOrderItem.item.itemId = 1;
      oldOrderItem.quantity = 1;
      existingOrder.orderItems = [oldOrderItem] as any;

      const item1 = new Item();
      item1.itemId = 1;
      item1.price = 100;

      const item2 = new Item();
      item2.itemId = 2;
      item2.price = 200;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock)
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item2)
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item2);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(mockEm.remove).toHaveBeenCalledWith(oldOrderItem);
      expect(mockEm.persist).toHaveBeenCalledTimes(2);
      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledTimes(4);
      // Calculation: item1 (3 * 100) + item2 (2 * 200) = 300 + 400 = 700
      expect(result.totalPurchase).toBe(700);
      // grandTotal = totalPurchase (700) + shippingCost (3000) = 3700
      expect(result.grandTotal).toBe(3700);
    });

    it("should recalculate grandTotal when shippingCost changes", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        shippingCost: 5000,
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(result.shippingCost).toBe(5000);
      expect(result.grandTotal).toBe(15000);
    });

    it("should not flush when flush parameter is false", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        po: "PO-002",
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);

      await MANAGE_ORDER.update(mockEm, orderId, updates, false);

      expect(ORDER_REPOSITORY.save).toHaveBeenCalledWith(mockEm, existingOrder);
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it("should update order with partial updates", async () => {
      const orderId = 1;
      const updates: OrderUpdateRequest = {
        note: "Updated note",
      };

      const existingOrder = new Order();
      existingOrder.orderId = orderId;
      existingOrder.po = "PO-001";
      existingOrder.shippingCost = 3000;
      existingOrder.totalPurchase = 10000;
      existingOrder.grandTotal = 13000;
      existingOrder.note = "Original note";

      const mockBuyer = new Person();
      mockBuyer.personId = 1;
      existingOrder.buyer = mockBuyer;

      const mockRecipient = new Person();
      mockRecipient.personId = 2;
      existingOrder.recipient = mockRecipient;

      existingOrder.orderItems = [] as any;

      (ORDER_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingOrder,
      );
      mockEm.populate.mockResolvedValue(undefined);
      (ORDER_REPOSITORY.save as jest.Mock).mockResolvedValue(existingOrder);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ORDER.update(mockEm, orderId, updates);

      expect(result.note).toBe("Updated note");
      expect(MANAGE_PERSON.updatePersonEntity).not.toHaveBeenCalled();
      expect(MANAGE_PERSON.createPersonEntity).not.toHaveBeenCalled();
    });
  });

  describe("getPersonFromUpsert", () => {
    it("should call updatePersonEntity with default flush=true when personId is provided", async () => {
      const personUpsert = {
        personId: 1,
        personName: "Test Person",
        phone: {
          phoneNumber: "555-1234",
          preferred: true,
        },
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Test Person";

      (MANAGE_PERSON.updatePersonEntity as jest.Mock).mockResolvedValue(
        mockPerson,
      );

      const result = await MANAGE_ORDER.getPersonFromUpsert(
        mockEm,
        personUpsert,
      );

      expect(MANAGE_PERSON.updatePersonEntity).toHaveBeenCalledWith(
        mockEm,
        expect.objectContaining({
          personName: "Test Person",
          phone: {
            phoneId: undefined,
            phoneNumber: "555-1234",
            preferred: true,
          },
        }),
        1,
        true, // default flush = true
      );
      expect(result).toBe(mockPerson);
    });

    it("should call createPersonEntity with default flush=true when personId is not provided", async () => {
      const personUpsert = {
        personName: "New Person",
        phone: {
          phoneNumber: "555-5678",
          preferred: true,
        },
      };

      const mockPerson = new Person();
      mockPerson.personId = 2;
      mockPerson.personName = "New Person";

      (MANAGE_PERSON.createPersonEntity as jest.Mock).mockResolvedValue(
        mockPerson,
      );

      const result = await MANAGE_ORDER.getPersonFromUpsert(
        mockEm,
        personUpsert,
      );

      expect(MANAGE_PERSON.createPersonEntity).toHaveBeenCalledWith(
        mockEm,
        {
          personName: "New Person",
          phoneNumber: "555-5678",
          address: undefined,
        },
        true, // default flush = true
      );
      expect(result).toBe(mockPerson);
    });
  });
});
