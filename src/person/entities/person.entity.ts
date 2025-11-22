import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { PersonPhone } from "../../person-phone/entities/person-phone.entity";
import { PersonAddress } from "../../person-address/entities/person-address.entity";
import { Order } from "../../order/entities/order.entity";

@Entity()
export class Person {
  @PrimaryKey({ fieldName: "person_id" })
  personId!: number;

  @Property({ fieldName: "person_name", length: 255 })
  personName!: string;

  @OneToMany(() => PersonPhone, (phone) => phone.person)
  phones = new Collection<PersonPhone>(this);

  @OneToMany(() => PersonAddress, (address) => address.person)
  addresses = new Collection<PersonAddress>(this);

  @OneToMany(() => Order, (order) => order.buyer)
  buyerOrders = new Collection<Order>(this);

  @OneToMany(() => Order, (order) => order.recipient)
  recipientOrders = new Collection<Order>(this);

  @Property({ fieldName: "created_at" })
  createdAt: Date = new Date();

  @Property({ fieldName: "updated_at", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
