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
    save: jest.fn(),
  },
}));

const mockEm = {
  flush: jest.fn(),
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

      const updatedItem = new Item();
      updatedItem.itemId = itemId;
      updatedItem.itemName = "Updated Item";
      updatedItem.price = 200;

      (ITEM_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingItem,
      );
      (ITEM_REPOSITORY.save as jest.Mock).mockResolvedValue(updatedItem);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ITEM.update(mockEm, updates, itemId);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        itemId,
      );
      expect(ITEM_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Item),
      );
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result).toBe(updatedItem);
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
      (ITEM_REPOSITORY.save as jest.Mock).mockImplementation((em, item) =>
        Promise.resolve(item),
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ITEM.update(mockEm, updates, itemId);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        itemId,
      );
      expect(ITEM_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Item),
      );
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
      (ITEM_REPOSITORY.save as jest.Mock).mockImplementation((em, item) =>
        Promise.resolve(item),
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ITEM.update(mockEm, updates, itemId);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        itemId,
      );
      expect(ITEM_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Item),
      );
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
      (ITEM_REPOSITORY.save as jest.Mock).mockImplementation((em, item) =>
        Promise.resolve(item),
      );

      await MANAGE_ITEM.update(mockEm, updates, itemId, false);

      expect(ITEM_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        itemId,
      );
      expect(ITEM_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Item),
      );
      expect(mockEm.flush).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should create a new item with provided data", async () => {
      const itemData: ItemCreateRequest = {
        itemName: "New Item",
        price: 150,
      };

      const newItem = new Item();
      newItem.itemName = "New Item";
      newItem.price = 150;

      (ITEM_REPOSITORY.save as jest.Mock).mockResolvedValue(newItem);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_ITEM.create(mockEm, itemData);

      expect(ITEM_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Item),
      );
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result).toBe(newItem);
      expect(result.itemName).toBe("New Item");
      expect(result.price).toBe(150);
    });

    it("should filter out undefined values when creating", async () => {
      const itemData: ItemCreateRequest = {
        itemName: "New Item",
        price: 150,
      };

      (ITEM_REPOSITORY.save as jest.Mock).mockImplementation((em, item) =>
        Promise.resolve(item),
      );
      mockEm.flush.mockResolvedValue(undefined);

      await MANAGE_ITEM.create(mockEm, itemData);

      expect(ITEM_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Item),
      );
      expect(mockEm.flush).toHaveBeenCalled();
      const savedItem = (ITEM_REPOSITORY.save as jest.Mock).mock.calls[0][1];
      expect(savedItem.itemName).toBe("New Item");
      expect(savedItem.price).toBe(150);
    });

    it("should not flush when flush parameter is false", async () => {
      const itemData: ItemCreateRequest = {
        itemName: "New Item",
        price: 150,
      };

      (ITEM_REPOSITORY.save as jest.Mock).mockImplementation((em, item) =>
        Promise.resolve(item),
      );

      await MANAGE_ITEM.create(mockEm, itemData, false);

      expect(ITEM_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Item),
      );
      expect(mockEm.flush).not.toHaveBeenCalled();
    });
  });
});
