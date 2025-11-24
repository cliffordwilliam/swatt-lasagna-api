import { Order } from "../../../src/order/entities/order.entity";
import { ORDER_REPOSITORY } from "../../../src/order/repositories/order-repository";
import { Person } from "../../../src/person/entities/person.entity";
import { Item } from "../../../src/item/entities/item.entity";
import { OrderItem } from "../../../src/order/entities/order-item.entity";
import { OrderFilter } from "../../../src/order/schemas/order";
import { OrderStatus, Payment } from "../../../src/order/schemas/enums";

describe("ORDER_REPOSITORY", () => {
  let mockEm: any;
  let mockBuyer: Person;
  let mockRecipient: Person;
  let mockItem: Item;

  beforeEach(() => {
    mockBuyer = new Person();
    mockBuyer.personId = 1;
    mockBuyer.personName = "Buyer";

    mockRecipient = new Person();
    mockRecipient.personId = 2;
    mockRecipient.personName = "Recipient";

    mockItem = new Item();
    mockItem.itemId = 1;
    mockItem.itemName = "Test Item";
    mockItem.price = 100;

    mockEm = {
      findOneOrFail: jest.fn(),
      findAndCount: jest.fn(),
      populate: jest.fn(),
    };
  });

  describe("getByIdOrFail", () => {
    it("should successfully get an order by id", async () => {
      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";

      mockEm.findOneOrFail.mockResolvedValue(mockOrder);

      const result = await ORDER_REPOSITORY.getByIdOrFail(mockEm, 1);

      expect(mockEm.findOneOrFail).toHaveBeenCalledWith(
        Order,
        { orderId: 1 },
        {
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result).toBe(mockOrder);
    });
  });

  describe("list", () => {
    it("should list orders with no filters", async () => {
      const filters: OrderFilter = {
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      const orderItem = new OrderItem();
      orderItem.item = mockItem;
      orderItem.quantity = 2;
      mockOrder.orderItems = [orderItem] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0].buyerId).toBe(1);
      expect(result.data[0].recipientId).toBe(2);
      expect(result.pagination.totalCount).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("should list orders with po filter", async () => {
      const filters: OrderFilter = {
        po: "PO-001",
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {
          $and: [{ po: { $ilike: "%PO-001%" } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list orders with buyerId filter", async () => {
      const filters: OrderFilter = {
        buyerId: 1,
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {
          $and: [{ buyer: { personId: 1 } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list orders with recipientId filter", async () => {
      const filters: OrderFilter = {
        recipientId: 2,
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {
          $and: [{ recipient: { personId: 2 } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list orders with orderStatus filter", async () => {
      const filters: OrderFilter = {
        orderStatus: OrderStatus.BelumBayar,
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {
          $and: [{ orderStatus: OrderStatus.BelumBayar }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list orders with payment filter", async () => {
      const filters: OrderFilter = {
        payment: Payment.Tunai,
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {
          $and: [{ payment: Payment.Tunai }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list orders with or mode", async () => {
      const filters: OrderFilter = {
        po: "PO-001",
        orderStatus: OrderStatus.BelumBayar,
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "or",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {
          $or: [
            { po: { $ilike: "%PO-001%" } },
            { orderStatus: OrderStatus.BelumBayar },
          ],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list orders with different sort fields", async () => {
      const filters: OrderFilter = {
        page: 1,
        pageSize: 10,
        sortField: "po",
        sortOrder: "desc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { po: "desc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should handle pagination correctly", async () => {
      const filters: OrderFilter = {
        page: 2,
        pageSize: 5,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 12]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {},
        {
          limit: 5,
          offset: 5,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.pageSize).toBe(5);
      expect(result.pagination.totalCount).toBe(12);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrevious).toBe(true);
    });

    it("should list orders with multiple filters in and mode", async () => {
      const filters: OrderFilter = {
        po: "PO-001",
        buyerId: 1,
        orderStatus: OrderStatus.BelumBayar,
        page: 1,
        pageSize: 10,
        sortField: "orderDate",
        sortOrder: "asc",
        mode: "and",
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {
          $and: [
            { po: { $ilike: "%PO-001%" } },
            { buyer: { personId: 1 } },
            { orderStatus: OrderStatus.BelumBayar },
          ],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list orders with invalid sort field defaulting to orderDate", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "invalid" as unknown as
          | "po"
          | "orderDate"
          | "deliveryDate"
          | "totalPurchase"
          | "grandTotal",
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockOrder = new Order();
      mockOrder.orderId = 1;
      mockOrder.po = "PO-001";
      mockOrder.buyer = mockBuyer;
      mockOrder.recipient = mockRecipient;
      mockOrder.orderItems = [] as any;

      mockEm.findAndCount.mockResolvedValue([[mockOrder], 1]);

      const result = await ORDER_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Order,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { orderDate: "asc" },
          populate: ["buyer", "recipient", "orderItems", "orderItems.item"],
        },
      );
      expect(result.data).toHaveLength(1);
    });
  });

  describe("populateRelations", () => {
    it("should populate order relations", async () => {
      const order = new Order();

      await ORDER_REPOSITORY.populateRelations(mockEm, order);

      expect(mockEm.populate).toHaveBeenCalledWith(order, [
        "buyer",
        "recipient",
        "orderItems",
        "orderItems.item",
      ]);
    });
  });
});
