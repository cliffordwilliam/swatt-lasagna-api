import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class WaffleEntity {
  @PrimaryKey({ fieldName: "waffle_id" })
  waffleId!: number;

  @Property({ fieldName: "waffle_name" })
  waffleName!: string;

  @Property({ fieldName: "waffle_category" })
  waffleCategory!: string;
}
