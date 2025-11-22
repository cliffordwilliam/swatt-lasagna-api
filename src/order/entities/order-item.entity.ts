import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Order } from "./order.entity";
import { Item } from "../../item/entities/item.entity";

@Entity({ tableName: "order_item" })
export class OrderItem {
  @ManyToOne(() => Order, {
    fieldName: "order_id",
    nullable: false,
    primary: true,
  })
  order!: Order;

  @ManyToOne(() => Item, {
    fieldName: "item_id",
    nullable: false,
    primary: true,
  })
  item!: Item;

  @Property({ fieldName: "quantity" })
  quantity!: number;
}
