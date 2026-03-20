import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOptions {
  color?: string;
  priceRange?: string;
  sortBy?: string;
}

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select
        value={filters.color || "all"}
        onValueChange={(value) =>
          onFilterChange({ ...filters, color: value === "all" ? undefined : value })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Colors</SelectItem>
          <SelectItem value="black">Black</SelectItem>
          <SelectItem value="white">White</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priceRange || "all"}
        onValueChange={(value) =>
          onFilterChange({ ...filters, priceRange: value === "all" ? undefined : value })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="0-300">Under R300</SelectItem>
          <SelectItem value="300-500">R300 - R500</SelectItem>
          <SelectItem value="500+">R500+</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy || "newest"}
        onValueChange={(value) =>
          onFilterChange({ ...filters, sortBy: value })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="name">Name: A to Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;
