# Kasi Street Style - Backend Server

Express.js server for authentication, payment processing, and order management.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and Yoco API keys.

3. **Run in development:**
   ```bash
   npm run dev
   ```

4. **Run in production:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### Payments
- `POST /api/payment/process-yoco` - Process Yoco payment token
- `POST /api/payment/verify-payment` - Verify payment status

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/user/:userId` - Get user's orders
- `PATCH /api/orders/:id` - Update order status

## Database Schema

See `database.md` for complete schema documentation.

## Technologies

- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT + bcryptjs
- **Payment:** Yoco SDK
- **HTTP Client:** Axios
