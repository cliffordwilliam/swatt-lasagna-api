# Person

## Description

Stores information about people in the system, including buyers and recipients of orders.

## Columns

### Record Details

| Column       | Type     | Constraints           | Description                                |
| ------------ | -------- | --------------------- | ------------------------------------------ |
| id           | STRING   | PRIMARY KEY, NOT NULL | Unique identifier for this person          |
| name         | STRING   | NOT NULL              | Full name of the person                    |
| address      | STRING   | NOT NULL              | Address of the person                      |
| phone_number | STRING   | NOT NULL              | Contact phone number                       |
| created_at   | DATETIME | NOT NULL              | Timestamp when the record was created      |
| updated_at   | DATETIME | NOT NULL              | Timestamp when the record was last updated |

## Enums

None

## Relationships

- order (buyer): each person can place many orders as a buyer (one-to-many)
- order (recipient): each person can receive many orders as a recipient (one-to-many)

## Indexes

- Primary key index on `id`
- Index on `phone_number` for quick lookup

## Business Rules

1. Phone number should be unique or validated for format
2. A person can be both a buyer and recipient in different orders
3. Person cannot be deleted if they have associated orders (as buyer or recipient)
