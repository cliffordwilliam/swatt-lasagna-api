import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class OrderStatusEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onUpdate: () => new Date() })
  updated_at!: Date;
}
