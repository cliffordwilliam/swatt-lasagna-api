import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { OrderItem } from "../../order/entities/order-item.entity";

@Entity()
export class Item {
  @PrimaryKey({ fieldName: "item_id" })
  itemId!: number;

  @Property({ fieldName: "item_name", length: 255, unique: true })
  itemName!: string;

  @Property({ fieldName: "price" })
  price!: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.item)
  orderItems = new Collection<OrderItem>(this);

  @Property({ fieldName: "created_at" })
  createdAt: Date = new Date();

  @Property({ fieldName: "updated_at", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
