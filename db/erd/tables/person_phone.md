# Person Phone

## Description

Stores phone numbers associated with people in the system. Each person can have multiple phone numbers, with one marked as preferred.

## Columns

### Record Details

| Column       | Type        | Constraints           | Description                                |
| ------------ | ----------- | --------------------- | ------------------------------------------ |
| phone_id     | SERIAL      | PRIMARY KEY, NOT NULL | Unique identifier for this phone record    |
| person_id    | INTEGER     | FOREIGN KEY, NOT NULL | Reference to person who owns this phone    |
| phone_number | VARCHAR(20) | NOT NULL              | Contact phone number                       |
| preferred    | BOOLEAN     | NOT NULL              | Whether this is the preferred phone number |
| created_at   | TIMESTAMP   | NOT NULL              | Timestamp when the record was created      |
| updated_at   | TIMESTAMP   | NOT NULL              | Timestamp when the record was last updated |

## Enums

None

## Relationships

- person: each phone number belongs to one person (many-to-one)

## Indexes

- Primary key index on `phone_id`
- Foreign key index on `person_id`
- Index on `phone_number` for quick lookup

## Business Rules

1. Phone number should be validated for format
2. A person can have multiple phone numbers
3. Only one phone number per person should be marked as preferred (enforced at application level)
4. Phone record cannot be deleted if it is the only phone for a person (enforced at application level)
