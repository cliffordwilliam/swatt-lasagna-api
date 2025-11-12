import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class PersonEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  address!: string;

  @Property()
  phone_number!: string;

  @Property({ onCreate: () => new Date() })
  created_at!: Date;

  @Property({ onUpdate: () => new Date() })
  updated_at!: Date;
}
