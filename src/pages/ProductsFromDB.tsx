import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url_front: string;
  image_url_back?: string;
  stock_quantity: number;
  created_at?: string;
}

const ProductsFromDB = () => {
  // Fetch products from Supabase
  const { data: products, loading, error } = useSupabaseData<Product>("products");

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
        <AlertCircle size={20} className="text-destructive flex-shrink-0" />
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No products found
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Products from Database</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {product.image_url_front && (
              <img
                src={product.image_url_front}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {product.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">R{product.price}</span>
                <span className="text-xs text-muted-foreground">
                  Stock: {product.stock_quantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsFromDB;
