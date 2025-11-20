# Person Address

## Description

Stores addresses associated with people in the system. Each person can have multiple addresses, with one marked as preferred.

## Columns

### Record Details

| Column     | Type         | Constraints           | Description                                |
| ---------- | ------------ | --------------------- | ------------------------------------------ |
| address_id | SERIAL       | PRIMARY KEY, NOT NULL | Unique identifier for this address record  |
| person_id  | INTEGER      | FOREIGN KEY, NOT NULL | Reference to person who owns this address  |
| address    | VARCHAR(500) | NOT NULL              | Full address text                          |
| preferred  | BOOLEAN      | NOT NULL              | Whether this is the preferred address      |
| created_at | TIMESTAMP    | NOT NULL              | Timestamp when the record was created      |
| updated_at | TIMESTAMP    | NOT NULL              | Timestamp when the record was last updated |

## Enums

None

## Relationships

- person: each address belongs to one person (many-to-one)

## Indexes

- Primary key index on `address_id`
- Foreign key index on `person_id`

## Business Rules

1. A person can have multiple addresses
2. Only one address per person should be marked as preferred (enforced at application level)
3. Address record cannot be deleted if it is the only address for a person (enforced at application level)
