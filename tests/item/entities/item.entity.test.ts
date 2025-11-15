import { Item } from "../../../src/item/entities/item.entity";

describe("Item Entity", () => {
  it("should create an item with default values", () => {
    const item = new Item();
    item.itemId = 1;
    item.itemName = "Test Item";
    item.price = 100;

    expect(item.itemId).toBe(1);
    expect(item.itemName).toBe("Test Item");
    expect(item.price).toBe(100);
    expect(item.createdAt).toBeInstanceOf(Date);
    expect(item.updatedAt).toBeInstanceOf(Date);
  });

  it("should allow setting updatedAt property", () => {
    const item = new Item();
    const newDate = new Date();
    item.updatedAt = newDate;
    expect(item.updatedAt).toBe(newDate);
  });

  it("should allow setting all properties", () => {
    const item = new Item();
    const createdAt = new Date("2024-01-01");
    const updatedAt = new Date("2024-01-02");

    item.itemId = 1;
    item.itemName = "Test Item";
    item.price = 100;
    item.createdAt = createdAt;
    item.updatedAt = updatedAt;

    expect(item.itemId).toBe(1);
    expect(item.itemName).toBe("Test Item");
    expect(item.price).toBe(100);
    expect(item.createdAt).toBe(createdAt);
    expect(item.updatedAt).toBe(updatedAt);
  });
});
