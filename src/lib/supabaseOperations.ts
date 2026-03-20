import { supabase } from "@/lib/supabase";

// Product operations
export const fetchProducts = async (filters?: {
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}) => {
  let query = supabase.from("products").select();

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, error } = await query.limit(filters?.limit || 100);
  return { data, error };
};

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select()
    .eq("id", id)
    .single();
  return { data, error };
};

// Order operations
export const fetchUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), payments(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const fetchOrderDetails = async (orderId: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*)), payments(*), customer_addresses(*)")
    .eq("id", orderId)
    .single();
  return { data, error };
};

export const createOrder = async (orderData: {
  user_id: string;
  order_number: string;
  total_amount: number;
  shipping_cost: number;
  shipping_method: string;
}) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select()
    .single();
  return { data, error };
};

export const updateOrderStatus = async (
  orderId: string,
  status: "pending" | "processing" | "shipped" | "delivered"
) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", orderId)
    .select()
    .single();
  return { data, error };
};

// Order items operations
export const createOrderItems = async (
  items: Array<{
    order_id: string;
    product_id: string;
    quantity: number;
    size: string;
    unit_price: number;
  }>
) => {
  const { data, error } = await supabase
    .from("order_items")
    .insert(items)
    .select();
  return { data, error };
};

// Payment operations
export const recordPayment = async (paymentData: {
  order_id: string;
  payment_method: string;
  payment_reference: string;
  amount: number;
  status: "pending" | "success" | "failed";
  response_data?: Record<string, unknown>;
}) => {
  const { data, error } = await supabase
    .from("payments")
    .insert([paymentData])
    .select()
    .single();
  return { data, error };
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: "pending" | "success" | "failed"
) => {
  const { data, error } = await supabase
    .from("payments")
    .update({ status })
    .eq("id", paymentId)
    .select()
    .single();
  return { data, error };
};

// Customer address operations
export const saveCustomerAddress = async (addressData: {
  user_id: string;
  order_id?: string;
  full_name: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
}) => {
  const { data, error } = await supabase
    .from("customer_addresses")
    .insert([addressData])
    .select()
    .single();
  return { data, error };
};

export const fetchUserAddresses = async (userId: string) => {
  const { data, error } = await supabase
    .from("customer_addresses")
    .select()
    .eq("user_id", userId);
  return { data, error };
};

// Search products
export const searchProducts = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from("products")
    .select()
    .or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  return { data, error };
};
