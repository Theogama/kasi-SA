import { supabase } from "@/lib/supabase";

export interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url_front: string | null;
  image_url_back: string | null;
  sizes: string[] | null;
  stock_quantity: number;
  color: string | null;
  details: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  frontImage: string;
  backImage: string;
  sizes: string[];
  stockQuantity: number;
  color: string;
  details: string[];
  inStock: boolean;
}

const FALLBACK_PRODUCTS: DbProduct[] = [
  {
    id: "a0000001-0001-4000-8000-000000000001",
    name: "Muscle Car Tee — Black",
    description:
      "Classic black tee featuring our iconic muscle car design. Made from premium cotton blend for comfort and durability.",
    price: 450,
    image_url_front: "/products/tee-black-front.png",
    image_url_back: "/products/tee-black-back.png",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    stock_quantity: 100,
    color: "black",
    details: [
      "100% Premium Cotton",
      "Oversized Fit",
      "Machine Washable",
      "High-Quality Print",
      "Comfortable & Breathable",
    ],
  },
  {
    id: "a0000002-0002-4000-8000-000000000002",
    name: "Muscle Car Tee — White",
    description:
      "Clean white tee with our signature muscle car design. Perfect for any occasion, versatile and timeless.",
    price: 450,
    image_url_front: "/products/tee-white-front.png",
    image_url_back: "/products/tee-white-back.png",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    stock_quantity: 100,
    color: "white",
    details: [
      "100% Premium Cotton",
      "Oversized Fit",
      "Machine Washable",
      "High-Quality Print",
      "Comfortable & Breathable",
    ],
  },
  {
    id: "a0000003-0003-4000-8000-000000000003",
    name: "Kasi World Tee — Black",
    description:
      "Bold Kasi World graphic on premium black cotton. A statement piece for the streets.",
    price: 450,
    image_url_front: "/products/kasi-world-tee-front.png",
    image_url_back: "/products/kasi-world-tee-back.png",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    stock_quantity: 100,
    color: "black",
    details: [
      "100% Premium Cotton",
      "Oversized Fit",
      "Machine Washable",
      "High-Quality Print",
      "Comfortable & Breathable",
    ],
  },
  {
    id: "a0000004-0004-4000-8000-000000000004",
    name: "From the Kasi Tee — White",
    description:
      "Clean white tee with a bold Kasi back graphic — made for everyday wear with premium comfort.",
    price: 450,
    image_url_front: "/products/tee-white-front.png",
    image_url_back: "/products/kasi-wheelbarrow-tee-back.png",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    stock_quantity: 100,
    color: "white",
    details: [
      "100% Premium Cotton",
      "Oversized Fit",
      "Machine Washable",
      "High-Quality Print",
      "Comfortable & Breathable",
    ],
  },
];

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

const DEFAULT_DETAILS = [
  "100% Premium Cotton",
  "Oversized Fit",
  "Machine Washable",
  "High-Quality Print",
  "Comfortable & Breathable",
];

export const formatPrice = (amount: number): string =>
  `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const parsePriceLabel = (label: string): number =>
  parseFloat(label.replace("R", "").replace(/,/g, ""));

export const resolveProductImage = (url: string | null | undefined, fallback = "/kasi-logo.png"): string => {
  if (!url) return fallback;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `/${url.replace(/^\//, "")}`;
};

export const mapDbProduct = (row: DbProduct): StoreProduct => {
  const price = Number(row.price);
  const stockQuantity = row.stock_quantity ?? 0;

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price,
    priceLabel: formatPrice(price),
    frontImage: resolveProductImage(row.image_url_front),
    backImage: resolveProductImage(row.image_url_back ?? row.image_url_front),
    sizes: row.sizes?.length ? row.sizes : DEFAULT_SIZES,
    stockQuantity,
    color: row.color ?? "black",
    details: row.details?.length ? row.details : DEFAULT_DETAILS,
    inStock: stockQuantity > 0,
  };
};

export const cartLineKey = (productId: string, size?: string) =>
  size ? `${productId}::${size}` : productId;

export const normalizeProductId = (id: string) => id.trim().toLowerCase();

export const getFallbackProducts = (): StoreProduct[] =>
  FALLBACK_PRODUCTS.map(mapDbProduct);

export const isFallbackProductId = (id: string) =>
  FALLBACK_PRODUCTS.some((p) => normalizeProductId(p.id) === normalizeProductId(id));

export type ProductStockRow = {
  id: string;
  name: string;
  stockQuantity: number;
};

/** Loads stock from Supabase only (checkout must use this, not fallback catalog). */
export const fetchProductStockByIds = async (
  productIds: string[]
): Promise<Map<string, ProductStockRow>> => {
  const uniqueIds = [...new Set(productIds.map(normalizeProductId))];
  if (uniqueIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, stock_quantity")
    .in("id", uniqueIds);

  if (error) throw error;

  return new Map(
    (data ?? []).map((row) => {
      const id = normalizeProductId(row.id as string);
      return [
        id,
        {
          id,
          name: row.name as string,
          stockQuantity: Number(row.stock_quantity ?? 0),
        },
      ];
    })
  );
};
