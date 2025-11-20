import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Person } from "../../person/entities/person.entity";

@Entity({ tableName: "person_phone" })
export class PersonPhone {
  @PrimaryKey({ fieldName: "phone_id" })
  phoneId!: number;

  @ManyToOne(() => Person, { fieldName: "person_id", nullable: false })
  person!: Person;

  @Property({ fieldName: "phone_number", length: 20 })
  phoneNumber!: string;

  @Property({ fieldName: "preferred" })
  preferred!: boolean;

  @Property({ fieldName: "created_at" })
  createdAt: Date = new Date();

  @Property({ fieldName: "updated_at", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
