import { filterDefinedValues } from "../../../src/common/utils/defined-entries";
import { getEM } from "../../../src/core/database/adapter";
import { Item } from "../../../src/item/entities/item.entity";
import { ItemRepository } from "../../../src/item/repositories/item-repository";
jest.mock("../../../src/core/database/adapter", () => ({
  getEM: jest.fn(),
}));

describe("ItemRepository", () => {
  let mockEm: any;

  beforeEach(() => {
    mockEm = {
      persistAndFlush: jest.fn(),
    };
    (getEM as jest.Mock).mockResolvedValue(mockEm);
  });

  it("should successfully save a valid item", async () => {
    const itemData = {
      itemName: "asd",
      price: 123,
    };

    const item = new Item();
    Object.assign(item, filterDefinedValues(itemData));

    const savedItem = await ItemRepository.save(item);

    expect(mockEm.persistAndFlush).toHaveBeenCalledWith(item);

    expect(savedItem).toBe(item);
  });
});
