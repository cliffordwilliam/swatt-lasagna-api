# Order Item

## Description

Junction table that links orders to items, storing the quantity of each item in an order.

## Columns

### Record Details

| Column   | Type    | Constraints           | Description                        |
| -------- | ------- | --------------------- | ---------------------------------- |
| order_id | STRING  | FOREIGN KEY, NOT NULL | Reference to the order             |
| item_id  | STRING  | FOREIGN KEY, NOT NULL | Reference to the item              |
| quantity | INTEGER | NOT NULL              | Quantity of the item in this order |

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
