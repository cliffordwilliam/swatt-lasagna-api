-- Create ENUM types
CREATE TYPE pickup_delivery_enum AS ENUM ('Pickup', 'Delivery', 'Gojek', 'Citytran', 'Paxel', 'Daytrans', 'Baraya', 'Lintas', 'Bineka', 'Jne');
CREATE TYPE payment_enum AS ENUM ('Tunai', 'Kartu Kredit', 'Transfer Bank', 'QRIS');
CREATE TYPE order_status_enum AS ENUM ('Downpayment', 'Belum bayar', 'Lunas');

-- Create person table
CREATE TABLE person (
  person_id SERIAL PRIMARY KEY,
  person_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on phone_number for quick lookup
CREATE INDEX idx_person_phone_number ON person(phone_number);

-- Create item table
CREATE TABLE item (
  item_id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL UNIQUE,
  price INTEGER NOT NULL CHECK (price > 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create order table
CREATE TABLE "order" (
  order_id SERIAL PRIMARY KEY,
  po VARCHAR(255) NOT NULL UNIQUE,
  buyer_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  order_date TIMESTAMP NOT NULL,
  delivery_date TIMESTAMP NOT NULL,
  total_purchase INTEGER NOT NULL,
  pickup_delivery pickup_delivery_enum NOT NULL,
  shipping_cost INTEGER NOT NULL,
  grand_total INTEGER NOT NULL CHECK (grand_total = total_purchase + shipping_cost),
  payment payment_enum NOT NULL,
  order_status order_status_enum NOT NULL,
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_id) REFERENCES person(person_id),
  CONSTRAINT fk_order_recipient FOREIGN KEY (recipient_id) REFERENCES person(person_id)
);

-- Create index on po for quick lookup
CREATE INDEX idx_order_po ON "order"(po);

-- Create order_item table (junction table)
CREATE TABLE order_item (
  order_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, item_id),
  CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES "order"(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_order_item_item FOREIGN KEY (item_id) REFERENCES item(item_id) ON DELETE CASCADE
);

-- Create indexes on foreign keys for better query performance
CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_order_item_item_id ON order_item(item_id);
