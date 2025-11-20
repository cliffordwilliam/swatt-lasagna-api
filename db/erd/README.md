# ERD

```mermaid
erDiagram
    item
    order
    order_item
    person
    person_phone
    person_address

    item ||--o{ order_item : "contains"
    order ||--o{ order_item : "has"
    order ||--o{ person : "placed by"
    order ||--o{ person : "received by"
    person ||--o{ order : "buyer orders"
    person ||--o{ order : "recipient orders"
    person ||--o{ person_phone : "has"
    person ||--o{ person_address : "has"
```
