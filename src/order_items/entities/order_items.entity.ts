import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class OrderItemEntity {
  @PrimaryKey()
  id!: number;

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onUpdate: () => new Date() })
  updated_at!: Date;
}
