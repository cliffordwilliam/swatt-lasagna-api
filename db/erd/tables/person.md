# Person

## Description

Stores information about people in the system, including buyers and recipients of orders.

## Columns

### Record Details

| Column       | Type      | Constraints           | Description                                |
| ------------ | --------- | --------------------- | ------------------------------------------ |
| person_id    | SERIAL    | PRIMARY KEY, NOT NULL | Unique identifier for this person          |
| person_name  | VARCHAR   | NOT NULL              | Full name of the person                    |
| address      | TEXT      | NOT NULL              | Address of the person                      |
| phone_number | VARCHAR   | NOT NULL              | Contact phone number                       |
| created_at   | TIMESTAMP | NOT NULL              | Timestamp when the record was created      |
| updated_at   | TIMESTAMP | NOT NULL              | Timestamp when the record was last updated |

## Enums

None

## Relationships

- order (buyer): each person can place many orders as a buyer (one-to-many)
- order (recipient): each person can receive many orders as a recipient (one-to-many)

## Indexes

- Primary key index on `person_id`
- Index on `phone_number` for quick lookup

## Business Rules

1. Phone number should be unique or validated for format
2. A person can be both a buyer and recipient in different orders
3. Person cannot be deleted if they have associated orders (as buyer or recipient)
