# Supabase Integration Guide

## Setup Complete ✅

Your Supabase client is now configured and ready to use in your app.

---

## Quick Usage Examples

### 1. **Fetch All Products**

```tsx
import { useSupabaseData } from "@/hooks/useSupabaseData";

function MyComponent() {
  const { data: products, loading, error } = useSupabaseData("products");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 2. **Fetch Single Product by ID**

```tsx
import { useSupabaseSingle } from "@/hooks/useSupabaseData";

function ProductDetail({ id }) {
  const { data: product, loading, error } = useSupabaseSingle("products", id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{product?.name}</div>;
}
```

### 3. **Fetch Filtered Data**

```tsx
const { data: userOrders } = useSupabaseData("orders", {
  column: "user_id",
  value: userId
});
```

---

## Files Created

### 1. `src/lib/supabase.ts`
Initializes your Supabase client using environment variables.

```tsx
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, key);
```

**Usage:** Import this in any component for direct Supabase access.

### 2. `src/hooks/useSupabaseData.ts`
Custom hooks for common Supabase operations:
- `useSupabaseData()` - Fetch list of records
- `useSupabaseSingle()` - Fetch single record by ID

**Features:**
- Loading state
- Error handling
- Automatic data fetching
- Type-safe with TypeScript

### 3. `src/pages/TodoExample.tsx`
Example component showing how to use the hook (fetches from `todos` table).

### 4. `src/pages/ProductsFromDB.tsx`
Example component showing how to fetch products from your database.

---

## Environment Variables

Your `.env.local` is already configured:

```
VITE_SUPABASE_URL=https://vpwgvzxagjjosewspkqr.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_27io22oBmlhSiSUM1OcCLw_Rdn3aAkq
```

These are **publishable keys** - safe for frontend use.

---

## Common Use Cases

### Fetch All Orders for Current User
```tsx
const { data: orders } = useSupabaseData("orders", {
  column: "user_id",
  value: userId // from useAuth()
});
```

### Fetch Products with Stock > 0
```tsx
const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select()
      .gt("stock_quantity", 0);
    
    setProducts(data || []);
  };

  fetchProducts();
}, []);
```

### Insert New Order
```tsx
const { error } = await supabase
  .from("orders")
  .insert({
    user_id: userId,
    order_number: "KSS-123456",
    total_amount: 500,
    payment_status: "pending"
  });
```

### Update Order Status
```tsx
await supabase
  .from("orders")
  .update({ order_status: "shipped" })
  .eq("id", orderId);
```

---

## Direct Supabase Usage

If you need more control, import the client directly:

```tsx
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase
  .from("products")
  .select()
  .gt("price", 100)
  .order("created_at", { ascending: false });
```

---

## Available Tables

From your database schema:
- `users`
- `products`
- `orders`
- `order_items`
- `payments`
- `customer_addresses`

---

## Error Handling Best Practices

```tsx
const { data, loading, error } = useSupabaseData("products");

if (error) {
  return (
    <div className="p-4 bg-red-100 border border-red-400 rounded">
      <p className="text-red-800">Failed to load products: {error}</p>
    </div>
  );
}
```

---

## Integration with Your App

### In Your Pages
Use the hooks in any page component:

```tsx
// src/pages/Index.tsx
import ProductsFromDB from "@/pages/ProductsFromDB";

export default function Index() {
  return (
    <div>
      <Hero />
      <ProductsFromDB />
      <Footer />
    </div>
  );
}
```

### In Cart Component
Fetch products when needed:

```tsx
import { useSupabaseData } from "@/hooks/useSupabaseData";

const { data: products } = useSupabaseData("products");
```

### In Checkout
Fetch user's orders:

```tsx
const { data: orders } = useSupabaseData("orders", {
  column: "user_id",
  value: userId
});
```

---

## TypeScript Support

Define your types:

```tsx
interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
}

const { data: products } = useSupabaseData<Product>("products");
```

---

## Next Steps

1. **Add products to your database** - Use Supabase dashboard or API
2. **Update ProductGrid.tsx** - Use `ProductsFromDB` instead of hardcoded data
3. **Fetch orders in Checkout** - Show user's past orders
4. **Build admin panel** - Manage products and orders

---

## Testing

### Add Sample Data
In Supabase dashboard → SQL Editor:

```sql
INSERT INTO products (name, description, price, stock_quantity, image_url_front)
VALUES 
  ('Classic Tee', 'Premium cotton t-shirt', 299, 50, 'https://...'),
  ('Essential Tee', 'Comfortable everyday shirt', 249, 100, 'https://...');
```

### Test in Your App
```tsx
import TodoExample from "@/pages/TodoExample";

// Add to App.tsx routes temporarily to test
<Route path="/test-supabase" element={<TodoExample />} />
```

---

## Troubleshooting

### Can't fetch data?
1. Check Supabase credentials in `.env.local`
2. Verify table exists in Supabase
3. Check browser console for errors
4. Ensure Row Level Security allows public access (if needed)

### Type errors?
```tsx
const { data: products } = useSupabaseData<Product>("products");
// Add the type parameter for full TypeScript support
```

### CORS issues?
- Your publishable key allows frontend access
- If issues persist, check Supabase project settings

---

## Learn More

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Database Schema](./DATABASE.md)
