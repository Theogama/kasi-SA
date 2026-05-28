import { supabase } from "@/lib/supabase";
import {
  fetchProductStockByIds,
  isFallbackProductId,
  normalizeProductId,
} from "@/lib/products";

export interface UserOrder {
  id: string;
  order_number: string;
  total_amount: number;
  shipping_cost: number;
  shipping_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
}

export const getOrCreateUserIdByEmail = async (params: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}) => {
  const { email, firstName = "", lastName = "", phone = "" } = params;

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to check existing user: ${fetchError.message}`);
  }

  if (existingUser?.id) return existingUser.id as string;

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([
      {
        email,
        password_hash: "clerk_authenticated_user",
        first_name: firstName,
        last_name: lastName,
        phone,
      },
    ])
    .select("id")
    .single();

  if (insertError) {
    throw new Error(`Failed to create database user: ${insertError.message}`);
  }

  return newUser.id as string;
};

export const fetchOrdersForEmail = async (email: string): Promise<UserOrder[]> => {
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (userError) throw userError;
  if (!user?.id) return [];

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) throw ordersError;
  return (orders ?? []) as UserOrder[];
};

export const fetchOrderByNumber = async (orderNumber: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, customer_addresses(*)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const isOrderPaid = (paymentStatus: string | null | undefined) => {
  const status = String(paymentStatus || "").toLowerCase();
  return status === "completed" || status === "success" || status === "paid";
};

export const validateCartStock = async (
  items: Array<{ id: string; quantity: number; name?: string; size?: string }>
) => {
  const productIds = [...new Set(items.map((item) => normalizeProductId(item.id)))];
  const stockMap = await fetchProductStockByIds(productIds);

  const quantityByProduct = new Map<string, number>();
  for (const item of items) {
    const id = normalizeProductId(item.id);
    quantityByProduct.set(id, (quantityByProduct.get(id) ?? 0) + item.quantity);
  }

  for (const [productId, totalQuantity] of quantityByProduct) {
    const product = stockMap.get(productId);
    const displayName =
      items.find((item) => normalizeProductId(item.id) === productId)?.name ?? "This product";

    if (!product) {
      if (isFallbackProductId(productId)) {
        return {
          ok: false as const,
          message:
            "Your cart has demo items that are not in the live store database yet. Run server/migrations/002_products_rls_payfast.sql in Supabase, then refresh and try again.",
        };
      }
      return {
        ok: false as const,
        message: `${displayName} is no longer available. Remove it from your cart and try again.`,
      };
    }

    if (product.stockQuantity < totalQuantity) {
      return {
        ok: false as const,
        message: `${product.name} only has ${product.stockQuantity} left in stock.`,
      };
    }
  }

  return { ok: true as const };
};

/** Removes cart lines that are missing from Supabase or exceed available stock. */
export const reconcileCartWithDatabase = async (
  items: Array<{ id: string; quantity: number; name?: string; size?: string }>
) => {
  const productIds = [...new Set(items.map((item) => normalizeProductId(item.id)))];
  const stockMap = await fetchProductStockByIds(productIds);

  const quantityByProduct = new Map<string, number>();
  for (const item of items) {
    const id = normalizeProductId(item.id);
    quantityByProduct.set(id, (quantityByProduct.get(id) ?? 0) + item.quantity);
  }

  const removeKeys = new Set<string>();
  const messages: string[] = [];

  for (const item of items) {
    const id = normalizeProductId(item.id);
    const lineKey = item.size ? `${item.id}::${item.size}` : item.id;
    const product = stockMap.get(id);

    if (!product) {
      removeKeys.add(lineKey);
      messages.push(`${item.name ?? "An item"} is no longer available`);
      continue;
    }

    const totalForProduct = quantityByProduct.get(id) ?? 0;
    if (product.stockQuantity < totalForProduct) {
      removeKeys.add(lineKey);
      messages.push(
        `${product.name} only has ${product.stockQuantity} left in stock`
      );
    }
  }

  const kept = items.filter((item) => {
    const lineKey = item.size ? `${item.id}::${item.size}` : item.id;
    return !removeKeys.has(lineKey);
  });

  return {
    items: kept,
    removedCount: items.length - kept.length,
    message: messages.length > 0 ? messages[0] : null,
  };
};
