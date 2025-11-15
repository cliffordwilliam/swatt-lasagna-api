# Order

## Description

Stores order information including buyer, recipient, payment method, delivery method, and order status.

## Columns

### Record Details

| Column          | Type     | Constraints           | Description                                       |
| --------------- | -------- | --------------------- | ------------------------------------------------- |
| id              | STRING   | PRIMARY KEY, NOT NULL | Unique identifier for this order                  |
| po              | STRING   | NOT NULL              | Purchase order number                             |
| buyer_id        | STRING   | FOREIGN KEY, NOT NULL | Reference to person who placed the order          |
| recipient_id    | STRING   | FOREIGN KEY, NOT NULL | Reference to person who receives the order        |
| order_date      | DATETIME | NOT NULL              | Date when the order was placed                    |
| delivery_date   | DATETIME | NOT NULL              | Expected or actual delivery date                  |
| total_purchase  | INTEGER  | NOT NULL              | Total amount of items purchased (before shipping) |
| pickup_delivery | STRING   | NOT NULL              | Method of pickup or delivery (enum)               |
| shipping_cost   | INTEGER  | NOT NULL              | Cost of shipping/delivery                         |
| grand_total     | INTEGER  | NOT NULL              | Total amount including shipping                   |
| payment         | STRING   | NOT NULL              | Payment method used (enum)                        |
| order_status    | STRING   | NOT NULL              | Current status of the order (enum)                |
| note            | STRING   | NULL                  | Additional notes about the order                  |
| created_at      | DATETIME | NOT NULL              | Timestamp when the record was created             |
| updated_at      | DATETIME | NOT NULL              | Timestamp when the record was last updated        |

## Enums

- pickup_delivery: 'Pickup', 'Delivery', 'Gojek', 'Citytran', 'Paxel', 'Daytrans', 'Baraya', 'Lintas', 'Bineka', 'Jne'
- payment: 'Tunai', 'Kartu Kredit', 'Transfer Bank', 'QRIS'
- order_status: 'Downpayment', 'Belum bayar', 'Lunas'

## Relationships

- person (buyer): each order belongs to one buyer (many-to-one)
- person (recipient): each order belongs to one recipient (many-to-one)
- order_item: each order has many order items (one-to-many)

## Indexes

- Primary key index on `id`
- Foreign key index on `buyer_id`
- Foreign key index on `recipient_id`
- Index on `po` for quick lookup

## Business Rules

1. PO number must be unique
2. Buyer and recipient can be the same person
3. Grand total must equal total_purchase + shipping_cost
4. Order status must be one of the defined enum values
5. Payment method must be one of the defined enum values
6. Pickup/delivery method must be one of the defined enum values
7. Order cannot be deleted if it has associated order_items
