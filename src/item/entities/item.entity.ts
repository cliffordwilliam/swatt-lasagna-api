import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Item {
  @PrimaryKey({ fieldName: "item_id" })
  itemId!: number;

  @Property({ fieldName: "item_name" })
  itemName!: string;

  @Property({ fieldName: "created_at" })
  createdAt: Date = new Date();

  @Property({ fieldName: "updated_at", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
