import { filterDefinedValues } from "../../../src/common/utils/defined-entries";
import { Item } from "../../../src/item/entities/item.entity";
import { ITEM_REPOSITORY } from "../../../src/item/repositories/item-repository";

describe("ITEM_REPOSITORY", () => {
  let mockEm: any;

  beforeEach(() => {
    mockEm = {
      persistAndFlush: jest.fn(),
      findOneOrFail: jest.fn(),
      findAndCount: jest.fn(),
    };
  });

  describe("save", () => {
    it("should successfully save a valid item", async () => {
      const itemData = {
        itemName: "asd",
        price: 123,
      };

      const item = new Item();
      Object.assign(item, filterDefinedValues(itemData));

      const savedItem = await ITEM_REPOSITORY.save(mockEm, item);

      expect(mockEm.persistAndFlush).toHaveBeenCalledWith(item);

      expect(savedItem).toBe(item);
    });
  });

  describe("getByIdOrFail", () => {
    it("should successfully get an item by id", async () => {
      const mockItem = new Item();
      mockItem.itemId = 1;
      mockItem.itemName = "Test Item";
      mockItem.price = 100;

      mockEm.findOneOrFail.mockResolvedValue(mockItem);

      const result = await ITEM_REPOSITORY.getByIdOrFail(mockEm, 1);

      expect(mockEm.findOneOrFail).toHaveBeenCalledWith(Item, { itemId: 1 });
      expect(result).toBe(mockItem);
    });
  });

  describe("list", () => {
    it("should list items with no filters", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "itemName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockItems = [new Item(), new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 2]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { itemName: "asc" },
        },
      );
      expect(result.data).toBe(mockItems);
      expect(result.pagination.totalCount).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrevious).toBe(false);
    });

    it("should list items with itemName filter", async () => {
      const filters = {
        itemName: "test",
        page: 1,
        pageSize: 10,
        sortField: "itemName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 1]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {
          $and: [{ itemName: { $ilike: "%test%" } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { itemName: "asc" },
        },
      );
      expect(result.data).toBe(mockItems);
    });

    it("should list items with itemName and price filters", async () => {
      const filters = {
        itemName: "test",
        price: 100,
        page: 1,
        pageSize: 10,
        sortField: "itemName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 1]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {
          $and: [{ itemName: { $ilike: "%test%" } }, { price: 100 }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { itemName: "asc" },
        },
      );
      expect(result.data).toBe(mockItems);
    });

    it("should list items with price filter only", async () => {
      const filters = {
        price: 100,
        page: 1,
        pageSize: 10,
        sortField: "itemName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 1]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {
          $and: [{ price: 100 }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { itemName: "asc" },
        },
      );
      expect(result.data).toBe(mockItems);
    });

    it("should list items with or mode", async () => {
      const filters = {
        itemName: "test",
        page: 1,
        pageSize: 10,
        sortField: "itemName" as const,
        sortOrder: "asc" as const,
        mode: "or" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 1]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {
          $or: [{ itemName: { $ilike: "%test%" } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { itemName: "asc" },
        },
      );
      expect(result.data).toBe(mockItems);
    });

    it("should list items with itemName and price filters in or mode", async () => {
      const filters = {
        itemName: "test",
        price: 100,
        page: 1,
        pageSize: 10,
        sortField: "itemName" as const,
        sortOrder: "asc" as const,
        mode: "or" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 1]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {
          $or: [{ itemName: { $ilike: "%test%" } }, { price: 100 }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { itemName: "asc" },
        },
      );
      expect(result.data).toBe(mockItems);
    });

    it("should list items with price sort field", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "price" as const,
        sortOrder: "desc" as const,
        mode: "and" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 1]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { price: "desc" },
        },
      );
      expect(result.data).toBe(mockItems);
    });

    it("should list items with invalid sort field defaulting to itemName", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "invalid" as unknown as "itemName" | "price",
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 1]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { itemName: "asc" },
        },
      );
      expect(result.data).toBe(mockItems);
    });

    it("should handle pagination correctly", async () => {
      const filters = {
        page: 2,
        pageSize: 5,
        sortField: "itemName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 12]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Item,
        {},
        {
          limit: 5,
          offset: 5,
          orderBy: { itemName: "asc" },
        },
      );
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.pageSize).toBe(5);
      expect(result.pagination.totalCount).toBe(12);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrevious).toBe(true);
    });

    it("should handle pagination on last page", async () => {
      const filters = {
        page: 3,
        pageSize: 5,
        sortField: "itemName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockItems = [new Item()];
      mockEm.findAndCount.mockResolvedValue([mockItems, 12]);

      const result = await ITEM_REPOSITORY.list(mockEm, filters);

      expect(result.pagination.page).toBe(3);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrevious).toBe(true);
    });
  });
});
