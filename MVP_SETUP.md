# MVP Setup Guide

## Phase 1: Authentication ✅ COMPLETED

### Frontend
- ✅ AuthContext with login, register, logout functionality
- ✅ Login page (`/login`)
- ✅ Register page (`/register`)
- ✅ Protected routes via `useAuth` hook
- ✅ Token storage in localStorage

### Backend
- ✅ Express.js server with CORS support
- ✅ `/api/auth/register` - Create user account with bcrypt password hashing
- ✅ `/api/auth/login` - Authenticate user and return JWT token
- ✅ `/api/auth/me` - Get current user profile (protected)
- ✅ `/api/auth/refresh` - Refresh JWT token (protected)
- ✅ JWT middleware for protected routes

### Setup Instructions

1. **Create Supabase project:**
   - Go to https://supabase.com
   - Create a new project
   - Get your `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

2. **Run database setup:**
   - In Supabase dashboard, go to SQL Editor
   - Copy content from `server/setup.sql`
   - Paste and execute to create all tables

3. **Configure backend:**
   ```bash
   cd server
   cp .env.example .env.local
   ```
   
   Fill in:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   JWT_SECRET=your_secret_key_generate_with_openssl_rand_32
   ```

4. **Install and run server:**
   ```bash
   npm install
   npm run dev  # Runs on http://localhost:5000
   ```

5. **Update frontend .env.local:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

6. **Run frontend (separate terminal):**
   ```bash
   npm run dev  # Runs on http://localhost:5173
   ```

---

## Phase 2: Database (IN PROGRESS)

### Database Schema
- ✅ Users table with authentication fields
- ✅ Products table with images and stock
- ✅ Orders table with status tracking
- ✅ Order items table with relationships
- ✅ Payments table for transaction records
- ✅ Customer addresses table for shipping

### API Endpoints
- ✅ `POST /api/orders` - Create new order
- ✅ `GET /api/orders/user` - Get user's orders
- ✅ `GET /api/orders/:orderId` - Get single order details
- ✅ `PATCH /api/orders/:orderId` - Update order status

### Frontend Integration
- [ ] Create Checkout page
- [ ] Integrate order creation with cart
- [ ] Display order history on account page
- [ ] Show order tracking details

---

## Phase 3: Yoco Payment Integration (NEXT)

### Backend
- ✅ `POST /api/payment/yoco/process` - Process payment token
- ✅ `POST /api/payment/yoco/verify` - Verify payment status
- ✅ `POST /api/payment/yoco/webhook` - Handle Yoco webhooks

### Frontend
- [ ] Add Yoco script to HTML head
- [ ] Create payment form with card tokenization
- [ ] Handle payment success/failure flows
- [ ] Show order confirmation page

### Setup Instructions
1. Get Yoco API credentials from https://www.yoco.com
2. Add to backend .env:
   ```
   VITE_YOCO_PUBLIC_KEY=your_public_key
   VITE_YOCO_SECRET_KEY=your_secret_key
   ```
3. Configure webhook URL in Yoco dashboard: `http://your-domain.com/api/payment/yoco/webhook`

---

## Testing Guide

### Test Registration/Login
1. Navigate to http://localhost:5173/register
2. Fill form and create account
3. Should redirect to home page
4. Open DevTools → Application → LocalStorage
5. Should see `authToken` saved

### Test Protected Routes
1. Logout (once logout button added)
2. Try accessing `/checkout`
3. Should redirect to `/login`

### Test Backend APIs
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Next Steps

1. **Add Navbar links for auth:**
   - Update Navbar to show Login/Register links when logged out
   - Show user profile menu when logged in

2. **Create Account page:**
   - Display user profile
   - Show order history
   - Allow profile updates

3. **Create Checkout page:**
   - Form for shipping address
   - Order summary
   - Payment method selection

4. **Integrate Yoco:**
   - Add payment processing
   - Handle payment status
   - Create order confirmation flow

5. **Add protection to sensitive routes:**
   - Create ProtectedRoute component
   - Require auth for checkout
   - Require auth for order history

---

## Troubleshooting

### Server won't start
- Check if port 5000 is in use: `netstat -ano | findstr :5000`
- Make sure all dependencies are installed: `npm install`
- Check .env.local file has all required variables

### Can't connect to database
- Verify Supabase credentials in .env.local
- Check that tables were created by running setup.sql
- In Supabase, check that Row Level Security is configured if needed

### CORS errors in browser
- Make sure server CORS is set to `http://localhost:5173`
- Check backend is running before frontend

### Token not persisting
- Check localStorage is enabled in browser
- Clear localStorage and try again
- Check JWT_SECRET is set and consistent
