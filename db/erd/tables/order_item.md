# Order Item

## Description

Junction table linking orders to items. Each row represents one item within an order and stores a snapshot of the item's name and price at the time the order was placed. This ensures order history remains accurate even if the item is later updated.

## Columns

### Record Details

| Column     | Type         | Constraints           | Description                              |
| ---------- | ------------ | --------------------- | ---------------------------------------- |
| order_id   | INTEGER      | FOREIGN KEY, NOT NULL | Reference to the order                   |
| item_id    | INTEGER      | FOREIGN KEY, NOT NULL | Reference to the item                    |
| quantity   | INTEGER      | NOT NULL              | Quantity of the item in this order       |
| item_name  | VARCHAR(255) | NOT NULL              | Snapshot of the item name at order time  |
| item_price | INTEGER      | NOT NULL              | Snapshot of the item price at order time |

## Enums

None

## Relationships

- order: each order_item belongs to one order (many-to-one)
- item: each order_item belongs to one item (many-to-one)

## Indexes

- Composite primary key on (`order_id`, `item_id`)
- Foreign key index on `order_id`
- Foreign key index on `item_id`

## Business Rules

1. The combination of order_id and item_id must be unique (composite primary key)
2. Quantity must be a positive integer (greater than 0)
3. An order_item cannot exist without a valid order
4. An order_item cannot exist without a valid item
5. item_name and item_price must reflect the item state at the time the order is created (historical snapshot)
