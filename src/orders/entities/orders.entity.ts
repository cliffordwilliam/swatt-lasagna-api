import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class OrderEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  po!: string;

  @Property()
  order_date!: Date;

  @Property()
  delivery_date!: Date;

  @Property()
  total_purchase!: number;

  @Property()
  shipping_cost!: number;

  @Property()
  grand_total!: number;

  @Property()
  note!: string;

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onUpdate: () => new Date() })
  updated_at!: Date;
}
