import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class WaffleEntity {
  @PrimaryKey()
  waffle_id!: number;

  @Property()
  waffle_name!: string;
}
