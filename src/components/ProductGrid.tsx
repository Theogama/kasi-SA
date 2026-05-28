import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import FilterBar, { FilterOptions } from "./FilterBar";
import { useProducts } from "@/hooks/useProducts";
import { AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  frontImage: string;
  backImage: string;
  color: string;
  imageClassName?: string;
  stockQuantity: number;
}

const ProductGrid = () => {
  const { products: dbProducts, loading, error, catalogSource } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});

  const products = useMemo<Product[]>(
    () =>
      dbProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.priceLabel,
        frontImage: product.frontImage,
        backImage: product.backImage,
        color: product.color,
        stockQuantity: product.stockQuantity,
      })),
    [dbProducts]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Color filter
    if (filters.color) {
      result = result.filter((product) =>
        product.color.toLowerCase().includes(filters.color!.toLowerCase())
      );
    }

    // Price filter
    if (filters.priceRange) {
      result = result.filter((product) => {
        const price = parseFloat(product.price.replace("R", "").replace(",", ""));
        if (filters.priceRange === "0-300") return price < 300;
        if (filters.priceRange === "300-500") return price >= 300 && price <= 500;
        if (filters.priceRange === "500+") return price > 500;
        return true;
      });
    }

    // Sort
    if (filters.sortBy) {
      if (filters.sortBy === "price-low") {
        result.sort((a, b) => {
          const priceA = parseFloat(a.price.replace("R", "").replace(",", ""));
          const priceB = parseFloat(b.price.replace("R", "").replace(",", ""));
          return priceA - priceB;
        });
      } else if (filters.sortBy === "price-high") {
        result.sort((a, b) => {
          const priceA = parseFloat(a.price.replace("R", "").replace(",", ""));
          const priceB = parseFloat(b.price.replace("R", "").replace(",", ""));
          return priceB - priceA;
        });
      } else if (filters.sortBy === "name") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return result;
  }, [searchQuery, filters, products]);

  const usingFallbackCatalog = !loading && !error && catalogSource === "fallback";

  return (
    <section id="shop" className="py-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div className="mb-8 md:mb-0">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-2">
              New Arrivals
            </p>
            <h2 className="text-5xl md:text-6xl font-heading">The Drop</h2>
          </div>
          <a
            href="#"
            className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          >
            View All →
          </a>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {usingFallbackCatalog && (
          <div className="mb-6 p-4 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-sm">
            Live catalog is empty in Supabase. Products are shown for preview only — checkout will not work until you run{" "}
            <code className="text-xs">server/migrations/002_products_rls_payfast.sql</code> in the Supabase SQL editor.
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-10 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </div>

        {loading && (
          <div className="text-sm text-muted-foreground mb-6">Loading products...</div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 max-w-7xl w-full justify-items-center">
              {filteredProducts.map((product) => (
                <div key={product.id} className="w-full max-w-[320px]">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilters({});
              }}
              className="text-sm text-foreground hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
