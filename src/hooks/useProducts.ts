import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  DbProduct,
  StoreProduct,
  fetchProductStockByIds,
  getFallbackProducts,
  mapDbProduct,
} from "@/lib/products";

export type CatalogSource = "database" | "fallback";

export const useProducts = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [catalogSource, setCatalogSource] = useState<CatalogSource>("database");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;
      const mapped = (data as DbProduct[] | null)?.map(mapDbProduct) ?? [];
      if (mapped.length > 0) {
        setProducts(mapped);
        setCatalogSource("database");
      } else {
        setProducts(getFallbackProducts());
        setCatalogSource("fallback");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
      setCatalogSource("database");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, catalogSource, refetch: fetchProducts };
};

export const useProduct = (productId: string | undefined) => {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (data) {
          setProduct(mapDbProduct(data as DbProduct));
          return;
        }
        const fallback = getFallbackProducts().find((item) => item.id === productId) ?? null;
        setProduct(fallback);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

export const fetchProductStock = async (productIds: string[]) => {
  const rows = await fetchProductStockByIds(productIds);
  return new Map([...rows.entries()].map(([id, row]) => [id, row.stockQuantity]));
};
