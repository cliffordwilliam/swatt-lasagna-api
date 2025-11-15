# Item

## Description

Stores information about items/products available in the system.

## Columns

### Record Details

| Column     | Type     | Constraints           | Description                                |
| ---------- | -------- | --------------------- | ------------------------------------------ |
| id         | STRING   | PRIMARY KEY, NOT NULL | Unique identifier for this item            |
| name       | STRING   | NOT NULL              | Name of the item                           |
| price      | INTEGER  | NOT NULL              | Price of the item                          |
| created_at | DATETIME | NOT NULL              | Timestamp when the record was created      |
| updated_at | DATETIME | NOT NULL              | Timestamp when the record was last updated |

## Enums

None

## Relationships

- order_item: each item can be in many order items (one-to-many)

## Indexes

- Primary key index on `id`

## Business Rules

1. Item name must be unique
2. Price must be a positive integer
3. Item cannot be deleted if it exists in any order_item
