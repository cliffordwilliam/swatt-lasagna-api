import { Item } from "../../../src/item/entities/item.entity";
import { ITEM_REPOSITORY } from "../../../src/item/repositories/item-repository";
import { MANAGE_ITEM } from "../../../src/item/services/manage-item";
import {
  ItemCreateRequest,
  ItemFilter,
  ItemUpdateRequest,
} from "../../../src/item/schemas/item";

jest.mock("../../../src/item/repositories/item-repository", () => ({
  ITEM_REPOSITORY: {
    list: jest.fn(),
    getByIdOrFail: jest.fn(),
  },
}));

const mockEm = {
  flush: jest.fn(),
  persist: jest.fn(),
} as any;

describe("MANAGE_ITEM", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should call ITEM_REPOSITORY.list with filters", async () => {
      const filters: ItemFilter = {
        page: 1,
        pageSize: 10,
        sortField: "itemName",
        sortOrder: "asc",
        mode: "and",
      };

      const mockResult = {
        data: [new Item()],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      (ITEM_REPOSITORY.list as jest.Mock).mockResolvedValue(mockResult);

      const result = await MANAGE_ITEM.list(mockEm, filters);

      expect(ITEM_REPOSITORY.list).toHaveBeenCalledWith(mockEm, filters);
      expect(result).toBe(mockResult);
    });
  });

  describe("getById", () => {
    it("should call ITEM_REPOSITORY.getByIdOrFail with itemId", async () => {
      const mockItem = new Item();
      mockItem.itemId = 1;
      mockItem.itemName = "Test Item";
      mockItem.price = 100;

      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(mockItem);

      const result = await MANAGE_ITEM.getById(mockEm, 1);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(mockEm, 1);
      expect(result).toBe(mockItem);
    });
  });

  describe("update", () => {
    it("should update an existing item with provided updates", async () => {
      const itemId = 1;
      const updates: ItemUpdateRequest = {
        itemName: "Updated Item",
        price: 200,
      };

      const existingItem = new Item();
      existingItem.itemId = itemId;
      existingItem.itemName = "Original Item";
      existingItem.price = 100;

      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingItem,
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ITEM.update(mockEm, updates, itemId);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        itemId,
      );
      expect(mockEm.persist).toHaveBeenCalledWith(existingItem);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result).toBe(existingItem);
      expect(result.itemName).toBe("Updated Item");
      expect(result.price).toBe(200);
    });

    it("should update an item with partial updates", async () => {
      const itemId = 1;
      const updates: ItemUpdateRequest = {
        itemName: "Updated Item",
      };

      const existingItem = new Item();
      existingItem.itemId = itemId;
      existingItem.itemName = "Original Item";
      existingItem.price = 100;

      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingItem,
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ITEM.update(mockEm, updates, itemId);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        itemId,
      );
      expect(mockEm.persist).toHaveBeenCalledWith(existingItem);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.itemName).toBe("Updated Item");
      expect(result.price).toBe(100); // Should remain unchanged
    });

    it("should filter out undefined values when updating", async () => {
      const itemId = 1;
      const updates: ItemUpdateRequest = {
        price: 200,
      };

      const existingItem = new Item();
      existingItem.itemId = itemId;
      existingItem.itemName = "Original Item";
      existingItem.price = 100;

      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingItem,
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ITEM.update(mockEm, updates, itemId);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        itemId,
      );
      expect(mockEm.persist).toHaveBeenCalledWith(existingItem);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.price).toBe(200);
      expect(result.itemName).toBe("Original Item"); // Should remain unchanged
    });

    it("should not flush when flush parameter is false", async () => {
      const itemId = 1;
      const updates: ItemUpdateRequest = {
        itemName: "Updated Item",
      };

      const existingItem = new Item();
      existingItem.itemId = itemId;
      existingItem.itemName = "Original Item";
      existingItem.price = 100;

      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingItem,
      );

      await MANAGE_ITEM.update(mockEm, updates, itemId, false);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        itemId,
      );
      expect(mockEm.persist).toHaveBeenCalledWith(existingItem);
      expect(mockEm.flush).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should create a new item with provided data", async () => {
      const itemData: ItemCreateRequest = {
        itemName: "New Item",
        price: 150,
      };

      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ITEM.create(mockEm, itemData);

      expect(mockEm.persist).toHaveBeenCalledWith(expect.any(Item));
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.itemName).toBe("New Item");
      expect(result.price).toBe(150);
    });

    it("should filter out undefined values when creating", async () => {
      const itemData: ItemCreateRequest = {
        itemName: "New Item",
        price: 150,
      };

      mockEm.flush.mockResolvedValue(undefined);

      await MANAGE_ITEM.create(mockEm, itemData);

      expect(mockEm.persist).toHaveBeenCalledWith(expect.any(Item));
      expect(mockEm.flush).toHaveBeenCalled();
      const savedItem = mockEm.persist.mock.calls[0][0] as Item;
      expect(savedItem.itemName).toBe("New Item");
      expect(savedItem.price).toBe(150);
    });

    it("should not flush when flush parameter is false", async () => {
      const itemData: ItemCreateRequest = {
        itemName: "New Item",
        price: 150,
      };

      await MANAGE_ITEM.create(mockEm, itemData, false);

      expect(mockEm.persist).toHaveBeenCalledWith(expect.any(Item));
      expect(mockEm.flush).not.toHaveBeenCalled();
    });
  });
});
