import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Person } from "../../person/entities/person.entity";
import { OrderItem } from "./order-item.entity";
import { PickupDelivery, Payment, OrderStatus } from "../schemas/enums";

@Entity({ tableName: "order" })
export class Order {
  @PrimaryKey({ fieldName: "order_id" })
  orderId!: number;

  @Property({ fieldName: "po", length: 255, unique: true })
  po!: string;

  @ManyToOne(() => Person, { fieldName: "buyer_id", nullable: false })
  buyer!: Person;

  @ManyToOne(() => Person, { fieldName: "recipient_id", nullable: false })
  recipient!: Person;

  @Property({ fieldName: "order_date" })
  orderDate!: Date;

  @Property({ fieldName: "delivery_date" })
  deliveryDate!: Date;

  @Property({ fieldName: "total_purchase" })
  totalPurchase!: number;

  @Property({
    fieldName: "pickup_delivery",
    type: "string",
    columnType: "pickup_delivery_enum",
  })
  pickupDelivery!: PickupDelivery;

  @Property({ fieldName: "shipping_cost" })
  shippingCost!: number;

  @Property({ fieldName: "grand_total" })
  grandTotal!: number;

  @Property({
    fieldName: "payment",
    type: "string",
    columnType: "payment_enum",
  })
  payment!: Payment;

  @Property({
    fieldName: "order_status",
    type: "string",
    columnType: "order_status_enum",
  })
  orderStatus!: OrderStatus;

  @Property({ fieldName: "note", type: "text", nullable: true })
  note?: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems = new Collection<OrderItem>(this);

  @Property({ fieldName: "created_at" })
  createdAt: Date = new Date();

  @Property({ fieldName: "updated_at", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
