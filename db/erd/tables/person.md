# Person

## Description

Stores information about people in the system, including buyers and recipients of orders.

## Columns

### Record Details

| Column      | Type      | Constraints           | Description                                |
| ----------- | --------- | --------------------- | ------------------------------------------ |
| person_id   | SERIAL    | PRIMARY KEY, NOT NULL | Unique identifier for this person          |
| person_name | VARCHAR   | NOT NULL              | Full name of the person                    |
| created_at  | TIMESTAMP | NOT NULL              | Timestamp when the record was created      |
| updated_at  | TIMESTAMP | NOT NULL              | Timestamp when the record was last updated |

## Enums

None

## Relationships

- order (buyer): each person can place many orders as a buyer (one-to-many)
- order (recipient): each person can receive many orders as a recipient (one-to-many)
- person_phone: each person can have many phone numbers (one-to-many)
- person_address: each person can have many addresses (one-to-many)

## Indexes

- Primary key index on `person_id`

## Business Rules

1. A person can be both a buyer and recipient in different orders
2. Person cannot be deleted if they have associated orders (as buyer or recipient)
3. Person should have at least one phone number (enforced at application level)
4. Person should have at least one address (enforced at application level)
