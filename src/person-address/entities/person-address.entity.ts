import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Person } from "../../person/entities/person.entity";

@Entity({ tableName: "person_address" })
export class PersonAddress {
  @PrimaryKey({ fieldName: "address_id" })
  addressId!: number;

  @ManyToOne(() => Person, { fieldName: "person_id", nullable: false })
  person!: Person;

  @Property({ fieldName: "address", length: 500 })
  address!: string;

  @Property({ fieldName: "preferred" })
  preferred!: boolean;

  @Property({ fieldName: "created_at" })
  createdAt: Date = new Date();

  @Property({ fieldName: "updated_at", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
