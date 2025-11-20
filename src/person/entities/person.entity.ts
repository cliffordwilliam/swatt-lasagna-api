import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { PersonPhone } from "../../person-phone/entities/person-phone.entity";
import { PersonAddress } from "../../person-address/entities/person-address.entity";

@Entity()
export class Person {
  @PrimaryKey({ fieldName: "person_id" })
  personId!: number;

  @Property({ fieldName: "person_name" })
  personName!: string;

  @OneToMany(() => PersonPhone, (phone) => phone.person)
  phones = new Collection<PersonPhone>(this);

  @OneToMany(() => PersonAddress, (address) => address.person)
  addresses = new Collection<PersonAddress>(this);

  @Property({ fieldName: "created_at" })
  createdAt: Date = new Date();

  @Property({ fieldName: "updated_at", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
