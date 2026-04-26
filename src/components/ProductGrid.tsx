import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import FilterBar, { FilterOptions } from "./FilterBar";
import teeBlackFront from "@/assets/tee-black-front.png";
import teeBlackBack from "@/assets/tee-black-back.png";
import teeWhiteFront from "@/assets/tee-white-front.png";
import teeWhiteBack from "@/assets/tee-white-back.png";
import kasiWorldTeeFront from "@/assets/kasi-world-tee-front.png";
import kasiWorldTeeBack from "@/assets/kasi-world-tee-back.png";

interface Product {
  id: string;
  name: string;
  price: string;
  frontImage: string;
  backImage: string;
  color: string;
  imageClassName?: string;
}

const products: Product[] = [
  {
    id: "tee-1",
    name: "Muscle Car Tee — Black",
    price: "R450.00",
    frontImage: teeBlackFront,
    backImage: teeBlackBack,
    color: "black",
  },
  {
    id: "tee-2",
    name: "Muscle Car Tee — White",
    price: "R450.00",
    frontImage: teeWhiteFront,
    backImage: teeWhiteBack,
    color: "white",
  },
  {
    id: "tee-3",
    name: "Kasi World Tee — Black",
    price: "R450.00",
    frontImage: kasiWorldTeeFront,
    backImage: kasiWorldTeeBack,
    color: "black",
    imageClassName: "w-[85%] h-[85%]",
  },
];

const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});

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
  }, [searchQuery, filters]);

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

        {/* Search and Filter Section */}
        <div className="mb-10 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </div>

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
