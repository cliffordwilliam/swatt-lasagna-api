import { Item } from "../../../src/item/entities/item.entity";
import { ItemRepository } from "../../../src/item/repositories/item-repository";
import { ManageItem } from "../../../src/item/services/manage-item";
import {
  ItemCreateRequest,
  ItemFilter,
  ItemUpdateRequest,
} from "../../../src/item/schemas/item";

jest.mock("../../../src/item/repositories/item-repository", () => ({
  ItemRepository: {
    list: jest.fn(),
    getByIdOrFail: jest.fn(),
    save: jest.fn(),
  },
}));

describe("ManageItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should call ItemRepository.list with filters", async () => {
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

      (ItemRepository.list as jest.Mock).mockResolvedValue(mockResult);

      const result = await ManageItem.list(filters);

      expect(ItemRepository.list).toHaveBeenCalledWith(filters);
      expect(result).toBe(mockResult);
    });
  });

  describe("getById", () => {
    it("should call ItemRepository.getByIdOrFail with itemId", async () => {
      const mockItem = new Item();
      mockItem.itemId = 1;
      mockItem.itemName = "Test Item";
      mockItem.price = 100;

      (ItemRepository.getByIdOrFail as jest.Mock).mockResolvedValue(mockItem);

      const result = await ManageItem.getById(1);

      expect(ItemRepository.getByIdOrFail).toHaveBeenCalledWith(1);
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

      (ItemRepository.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingItem,
      );
      (ItemRepository.save as jest.Mock).mockResolvedValue(updatedItem);

      const result = await ManageItem.update(updates, itemId);

      expect(ItemRepository.getByIdOrFail).toHaveBeenCalledWith(itemId);
      expect(ItemRepository.save).toHaveBeenCalled();
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

      (ItemRepository.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingItem,
      );
      (ItemRepository.save as jest.Mock).mockImplementation((item) =>
        Promise.resolve(item),
      );

      const result = await ManageItem.update(updates, itemId);

      expect(ItemRepository.getByIdOrFail).toHaveBeenCalledWith(itemId);
      expect(ItemRepository.save).toHaveBeenCalled();
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

      (ItemRepository.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingItem,
      );
      (ItemRepository.save as jest.Mock).mockImplementation((item) =>
        Promise.resolve(item),
      );

      const result = await ManageItem.update(updates, itemId);

      expect(ItemRepository.getByIdOrFail).toHaveBeenCalledWith(itemId);
      expect(ItemRepository.save).toHaveBeenCalled();
      expect(result.price).toBe(200);
      expect(result.itemName).toBe("Original Item"); // Should remain unchanged
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

      (ItemRepository.save as jest.Mock).mockResolvedValue(newItem);

      const result = await ManageItem.create(itemData);

      expect(ItemRepository.save).toHaveBeenCalled();
      expect(result).toBe(newItem);
      expect(result.itemName).toBe("New Item");
      expect(result.price).toBe(150);
    });

    it("should filter out undefined values when creating", async () => {
      const itemData: ItemCreateRequest = {
        itemName: "New Item",
        price: 150,
      };

      (ItemRepository.save as jest.Mock).mockImplementation((item) =>
        Promise.resolve(item),
      );

      await ManageItem.create(itemData);

      expect(ItemRepository.save).toHaveBeenCalled();
      const savedItem = (ItemRepository.save as jest.Mock).mock.calls[0][0];
      expect(savedItem.itemName).toBe("New Item");
      expect(savedItem.price).toBe(150);
    });
  });
});
