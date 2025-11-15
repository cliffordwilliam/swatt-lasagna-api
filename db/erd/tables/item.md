# Item

## Description

Stores information about items/products available in the system.

## Columns

### Record Details

| Column     | Type      | Constraints           | Description                                |
| ---------- | --------- | --------------------- | ------------------------------------------ |
| item_id    | SERIAL    | PRIMARY KEY, NOT NULL | Unique identifier for this item            |
| item_name  | VARCHAR   | NOT NULL              | Name of the item                           |
| price      | INTEGER   | NOT NULL              | Price of the item                          |
| created_at | TIMESTAMP | NOT NULL              | Timestamp when the record was created      |
| updated_at | TIMESTAMP | NOT NULL              | Timestamp when the record was last updated |

## Enums

None

## Relationships

- order_item: each item can be in many order items (one-to-many)

## Indexes

- Primary key index on `item_id`

## Business Rules

1. Item name must be unique
2. Price must be a positive integer
3. Item cannot be deleted if it exists in any order_item
