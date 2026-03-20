# Testing Your Supabase Integration

## Quick Test: Add Sample Data

### 1. Add Sample Products

Go to your Supabase dashboard → SQL Editor and run:

```sql
INSERT INTO products (name, description, price, image_url_front, stock_quantity, created_at)
VALUES 
  ('Classic Tee', 'Premium 100% cotton t-shirt', 299, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 50, NOW()),
  ('Essential Tee', 'Comfortable everyday shirt', 249, 'https://images.unsplash.com/photo-1503341338985-36a6dceed147?w=500', 100, NOW()),
  ('Premium Tee', 'High-quality cotton blend', 349, 'https://images.unsplash.com/photo-1556821552-9f51fee7d362?w=500', 30, NOW()),
  ('Oversized Tee', 'Relaxed fit t-shirt', 329, 'https://images.unsplash.com/photo-1512990104387-e11e6789b5ca?w=500', 75, NOW());
```

---

### 2. Test Component 1: Display All Products

Update `src/App.tsx` to add a test route:

```tsx
import ProductsFromDB from "./pages/ProductsFromDB";

// Add this route:
<Route path="/test-products" element={<ProductsFromDB />} />
```

Then visit: `http://localhost:5173/test-products`

You should see 4 products from your database displayed in a grid.

---

### 3. Test Component 2: Todo List

Add this test route to `src/App.tsx`:

```tsx
import TodoExample from "./pages/TodoExample";

// Add this route:
<Route path="/test-todos" element={<TodoExample />} />
```

First add sample todos to Supabase:

```sql
INSERT INTO todos (title, completed) VALUES
  ('Learn React', false),
  ('Build Supabase app', true),
  ('Deploy to production', false);
```

Then visit: `http://localhost:5173/test-todos`

---

### 4. Test Direct Supabase Query

Create a test file `src/pages/TestSupabase.tsx`:

```tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const TestSupabase = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const test = async () => {
      try {
        // Test 1: Fetch products
        const { data: products, error: err } = await supabase
          .from("products")
          .select()
          .limit(5);

        if (err) throw err;

        setResult({
          productCount: products?.length,
          products: products,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    test();
  }, []);

  if (loading) return <div className="p-4">Testing connection...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
      
      <div className="bg-green-100 border border-green-400 p-4 rounded">
        <p className="text-green-800">✅ Connection Successful</p>
        <p>Found {result?.productCount} products in database</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-bold">Products:</h2>
        {result?.products?.map((p) => (
          <div key={p.id} className="p-3 bg-gray-100 rounded">
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-gray-600">R{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSupabase;
```

Add route:
```tsx
<Route path="/test-supabase" element={<TestSupabase />} />
```

Visit: `http://localhost:5173/test-supabase`

---

## Test Scenarios

### ✅ Test 1: Fetch All Products
```tsx
const { data: products } = useSupabaseData("products");
// Should show all products with loading and error states
```

### ✅ Test 2: Filter Products
```tsx
const { data: premiumProducts } = useSupabaseData("products", {
  column: "price",
  value: 300
});
// Should filter products (requires proper query building)
```

### ✅ Test 3: Search Products
```tsx
const { data: results } = await searchProducts("classic");
// Should find "Classic Tee"
```

### ✅ Test 4: Fetch Orders
```tsx
const { data: orders } = await fetchUserOrders(userId);
// Should return user's orders with related data
```

### ✅ Test 5: Create Order
```tsx
const { data: order } = await createOrder({
  user_id: userId,
  order_number: "KSS-" + Date.now(),
  total_amount: 599,
  shipping_cost: 65,
  shipping_method: "paxel_standard"
});
// Should create new order in database
```

---

## Browser Testing Steps

### 1. Open DevTools (F12)

### 2. Go to Application Tab

### 3. Check Network Tab
- Should see requests to `supabase.co` with your API key
- Status should be `200 OK` for successful queries

### 4. Check Console
- Should have no CORS errors
- Should see data logged from Supabase

### 5. Test Component Load
```tsx
// Add this to test component temporarily
useEffect(() => {
  console.log("Supabase data:", data);
  console.log("Loading:", loading);
  console.log("Error:", error);
}, [data, loading, error]);
```

---

## Troubleshooting

### "Cannot find table" error
**Solution:** Table doesn't exist in Supabase
- Go to Supabase dashboard
- Check Tables section
- Run `server/setup.sql` in SQL Editor

### "No data returned"
**Solution:** Table is empty
- Add sample data using SQL above
- Or use Supabase dashboard UI to add rows

### CORS error in browser
**Solution:** Environment variables missing
- Check `.env.local` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Restart dev server after changing env

### "Unauthorized" error
**Solution:** Row Level Security is blocking access
- Go to Supabase → Authentication → Policies
- For testing, temporarily disable RLS on tables
- Or create proper RLS policies

---

## Production Checklist

- [ ] Remove test routes from `App.tsx`
- [ ] Add proper error messages to users
- [ ] Implement loading skeletons for better UX
- [ ] Set up Row Level Security policies
- [ ] Test with real user data
- [ ] Monitor Supabase dashboard for errors
- [ ] Set up backup strategy

---

## Expected Output

### ProductsFromDB Component Should Show:
```
Products from Database
┌─────────────────────────────────────────┐
│ [Image]                                 │
│ Classic Tee                             │
│ Premium 100% cotton t-shirt             │
│ R299.00          Stock: 50              │
└─────────────────────────────────────────┘
```

### TodoExample Component Should Show:
```
Todos
├─ Learn React
├─ Build Supabase app
└─ Deploy to production
```

### TestSupabase Component Should Show:
```
✅ Connection Successful
Found 4 products in database

Products:
- Classic Tee  R299
- Essential Tee  R249
- Premium Tee  R349
- Oversized Tee  R329
```

---

## Next Steps

1. ✅ Add sample products/todos to database
2. ✅ Test `ProductsFromDB` component
3. ✅ Test `TodoExample` component
4. ✅ Test `TestSupabase` connection
5. ⏳ Integrate `ProductsFromDB` into Index page
6. ⏳ Use helper functions in Checkout
7. ⏳ Add payment recording functions

All test code is ready to use!
