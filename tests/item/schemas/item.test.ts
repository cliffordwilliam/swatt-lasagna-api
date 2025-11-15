import {
  Item,
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemFilter,
  CreateItemResponse,
  UpdateItemResponse,
  GetItemResponse,
  ListItemResponse,
  ItemSortFieldRequest,
} from "../../../src/item/schemas/item";

describe("Item Schemas", () => {
  describe("Item", () => {
    it("should parse a valid item", () => {
      const validItem = {
        itemId: 1,
        itemName: "Test Item",
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = Item.parse(validItem);

      expect(result.itemId).toBe(1);
      expect(result.itemName).toBe("Test Item");
      expect(result.price).toBe(100);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it("should reject invalid item data", () => {
      const invalidItem = {
        itemId: "not a number",
        itemName: "Test Item",
        price: 100,
      };

      expect(() => Item.parse(invalidItem)).toThrow();
    });
  });

  describe("ItemSortFieldRequest", () => {
    it("should parse valid sort field", () => {
      const result = ItemSortFieldRequest.parse({ sortField: "itemName" });
      expect(result.sortField).toBe("itemName");
    });

    it("should parse valid price sort field", () => {
      const result = ItemSortFieldRequest.parse({ sortField: "price" });
      expect(result.sortField).toBe("price");
    });

    it("should default to itemName when sortField is not provided", () => {
      const result = ItemSortFieldRequest.parse({});
      expect(result.sortField).toBe("itemName");
    });

    it("should reject invalid sort field", () => {
      expect(() =>
        ItemSortFieldRequest.parse({ sortField: "invalid" }),
      ).toThrow();
    });
  });

  describe("ItemCreateRequest", () => {
    it("should parse valid create request", () => {
      const validRequest = {
        itemName: "New Item",
        price: 100,
      };

      const result = ItemCreateRequest.parse(validRequest);

      expect(result.itemName).toBe("New Item");
      expect(result.price).toBe(100);
    });

    it("should coerce string price to number", () => {
      const request = {
        itemName: "New Item",
        price: "100",
      };

      const result = ItemCreateRequest.parse(request);

      expect(result.price).toBe(100);
      expect(typeof result.price).toBe("number");
    });

    it("should reject empty item name", () => {
      const invalidRequest = {
        itemName: "",
        price: 100,
      };

      expect(() => ItemCreateRequest.parse(invalidRequest)).toThrow();
    });

    it("should reject item name that is too long", () => {
      const invalidRequest = {
        itemName: "a".repeat(101),
        price: 100,
      };

      expect(() => ItemCreateRequest.parse(invalidRequest)).toThrow();
    });

    it("should reject price less than 1", () => {
      const invalidRequest = {
        itemName: "Test Item",
        price: 0,
      };

      expect(() => ItemCreateRequest.parse(invalidRequest)).toThrow();
    });

    it("should reject price greater than 50,000,000", () => {
      const invalidRequest = {
        itemName: "Test Item",
        price: 50000001,
      };

      expect(() => ItemCreateRequest.parse(invalidRequest)).toThrow();
    });

    it("should reject missing item name", () => {
      const invalidRequest = {
        price: 100,
      };

      expect(() => ItemCreateRequest.parse(invalidRequest)).toThrow();
    });

    it("should reject missing price", () => {
      const invalidRequest = {
        itemName: "Test Item",
      };

      expect(() => ItemCreateRequest.parse(invalidRequest)).toThrow();
    });
  });

  describe("ItemUpdateRequest", () => {
    it("should parse valid update request with all fields", () => {
      const validRequest = {
        itemName: "Updated Item",
        price: 200,
      };

      const result = ItemUpdateRequest.parse(validRequest);

      expect(result.itemName).toBe("Updated Item");
      expect(result.price).toBe(200);
    });

    it("should parse valid update request with only itemName", () => {
      const validRequest = {
        itemName: "Updated Item",
      };

      const result = ItemUpdateRequest.parse(validRequest);

      expect(result.itemName).toBe("Updated Item");
      expect(result.price).toBeUndefined();
    });

    it("should parse valid update request with only price", () => {
      const validRequest = {
        price: 200,
      };

      const result = ItemUpdateRequest.parse(validRequest);

      expect(result.price).toBe(200);
      expect(result.itemName).toBeUndefined();
    });

    it("should parse empty update request", () => {
      const validRequest = {};

      const result = ItemUpdateRequest.parse(validRequest);

      expect(result.itemName).toBeUndefined();
      expect(result.price).toBeUndefined();
    });

    it("should coerce string price to number", () => {
      const request = {
        price: "200",
      };

      const result = ItemUpdateRequest.parse(request);

      expect(result.price).toBe(200);
      expect(typeof result.price).toBe("number");
    });

    it("should reject empty item name", () => {
      const invalidRequest = {
        itemName: "",
        price: 100,
      };

      expect(() => ItemUpdateRequest.parse(invalidRequest)).toThrow();
    });

    it("should reject item name that is too long", () => {
      const invalidRequest = {
        itemName: "a".repeat(101),
        price: 100,
      };

      expect(() => ItemUpdateRequest.parse(invalidRequest)).toThrow();
    });

    it("should reject price less than 1", () => {
      const invalidRequest = {
        itemName: "Test Item",
        price: 0,
      };

      expect(() => ItemUpdateRequest.parse(invalidRequest)).toThrow();
    });

    it("should reject price greater than 50,000,000", () => {
      const invalidRequest = {
        itemName: "Test Item",
        price: 50000001,
      };

      expect(() => ItemUpdateRequest.parse(invalidRequest)).toThrow();
    });
  });

  describe("ItemFilter", () => {
    it("should parse valid filter with all fields", () => {
      const validFilter = {
        itemName: "test",
        price: 100,
        page: 1,
        pageSize: 10,
        sortField: "itemName",
        sortOrder: "asc",
        mode: "and",
      };

      const result = ItemFilter.parse(validFilter);

      expect(result.itemName).toBe("test");
      expect(result.price).toBe(100);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.sortField).toBe("itemName");
      expect(result.sortOrder).toBe("asc");
      expect(result.mode).toBe("and");
    });

    it("should parse valid filter with minimal fields", () => {
      const validFilter = {
        page: 1,
        pageSize: 10,
      };

      const result = ItemFilter.parse(validFilter);

      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.itemName).toBeUndefined();
      expect(result.price).toBeUndefined();
    });

    it("should coerce string values to numbers", () => {
      const filter = {
        price: "100",
        page: "1",
        pageSize: "10",
      };

      const result = ItemFilter.parse(filter);

      expect(result.price).toBe(100);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it("should transform mode to lowercase", () => {
      const filter = {
        mode: "AND",
        page: 1,
        pageSize: 10,
      };

      const result = ItemFilter.parse(filter);

      expect(result.mode).toBe("and");
    });

    it("should transform sortOrder to lowercase", () => {
      const filter = {
        sortOrder: "DESC",
        page: 1,
        pageSize: 10,
      };

      const result = ItemFilter.parse(filter);

      expect(result.sortOrder).toBe("desc");
    });

    it("should reject item name that is too long", () => {
      const invalidFilter = {
        itemName: "a".repeat(101),
        page: 1,
        pageSize: 10,
      };

      expect(() => ItemFilter.parse(invalidFilter)).toThrow();
    });

    it("should reject price greater than 50,000,000", () => {
      const invalidFilter = {
        price: 50000001,
        page: 1,
        pageSize: 10,
      };

      expect(() => ItemFilter.parse(invalidFilter)).toThrow();
    });
  });

  describe("CreateItemResponse", () => {
    it("should parse valid create response", () => {
      const validResponse = {
        success: true,
        data: {
          itemId: 1,
          itemName: "Test Item",
          price: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const result = CreateItemResponse.parse(validResponse);

      expect(result.success).toBe(true);
      expect(result.data.itemId).toBe(1);
      expect(result.data.itemName).toBe("Test Item");
    });

    it("should reject invalid create response", () => {
      const invalidResponse = {
        success: false,
        data: null,
      };

      expect(() => CreateItemResponse.parse(invalidResponse)).toThrow();
    });
  });

  describe("UpdateItemResponse", () => {
    it("should parse valid update response", () => {
      const validResponse = {
        success: true,
        data: {
          itemId: 1,
          itemName: "Updated Item",
          price: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const result = UpdateItemResponse.parse(validResponse);

      expect(result.success).toBe(true);
      expect(result.data.itemId).toBe(1);
      expect(result.data.itemName).toBe("Updated Item");
    });
  });

  describe("GetItemResponse", () => {
    it("should parse valid get response", () => {
      const validResponse = {
        success: true,
        data: {
          itemId: 1,
          itemName: "Test Item",
          price: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const result = GetItemResponse.parse(validResponse);

      expect(result.success).toBe(true);
      expect(result.data.itemId).toBe(1);
    });
  });

  describe("ListItemResponse", () => {
    it("should parse valid list response", () => {
      const validResponse = {
        success: true,
        data: [
          {
            itemId: 1,
            itemName: "Item 1",
            price: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            itemId: 2,
            itemName: "Item 2",
            price: 200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          page: 1,
          pageSize: 10,
          totalCount: 2,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      const result = ListItemResponse.parse(validResponse);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      const resultWithMeta = result as {
        meta: { totalCount: number; page: number };
      };
      expect(resultWithMeta.meta.totalCount).toBe(2);
      expect(resultWithMeta.meta.page).toBe(1);
    });

    it("should parse valid list response with empty data", () => {
      const validResponse = {
        success: true,
        data: [],
        meta: {
          page: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };

      const result = ListItemResponse.parse(validResponse);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
      const resultWithMeta = result as { meta: { totalCount: number } };
      expect(resultWithMeta.meta.totalCount).toBe(0);
    });
  });
});
