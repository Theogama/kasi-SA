# Database Schema for Kasi Street Style

## Tables

### users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `first_name` (String)
- `last_name` (String)
- `phone` (String)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### products
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `price` (Decimal)
- `image_url_front` (String)
- `image_url_back` (String)
- `sizes` (Array: XS, S, M, L, XL, 2XL)
- `stock_quantity` (Integer)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### orders
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `order_number` (String, Unique)
- `total_amount` (Decimal)
- `shipping_cost` (Decimal)
- `shipping_method` (String: paxel_standard, paxel_express, courier_standard, courier_same_day)
- `payment_status` (String: pending, processing, completed, failed)
- `order_status` (String: pending, processing, shipped, delivered)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### order_items
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → orders)
- `product_id` (UUID, Foreign Key → products)
- `quantity` (Integer)
- `size` (String)
- `unit_price` (Decimal)
- `created_at` (Timestamp)

### payments
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → orders)
- `payment_method` (String: yoco, payfast, bank_transfer, cod)
- `payment_reference` (String)
- `amount` (Decimal)
- `status` (String: pending, success, failed)
- `response_data` (JSON)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### customer_addresses
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `order_id` (UUID, Foreign Key → orders)
- `full_name` (String)
- `email` (String)
- `phone` (String)
- `street_address` (String)
- `city` (String)
- `province` (String)
- `postal_code` (String)
- `created_at` (Timestamp)

## SQL Setup Script

See `setup.sql` for initial table creation queries.
