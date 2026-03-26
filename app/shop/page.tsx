"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import ProductCard from "@/components/home/ProductCard";
import FilterButton from "@/components/shop/FilterButton"; // Kept for mobile if needed, or replace with Sidebar usage
import FilterSidebar from "@/components/shop/FilterSidebar";
import { getProducts, getCategories } from "@/app/actions/product";

// ShopPage component displays the product listing page with sorting and filtering functionality
import { Suspense } from "react";

// The component that uses useSearchParams
const ShopPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); // Could implement mobile drawer later

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Fetch Products when URL params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryId = searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId")!) : undefined;
        const subcategoryId = searchParams.get("subcategoryId") ? parseInt(searchParams.get("subcategoryId")!) : undefined;
        const search = searchParams.get("search") || undefined;
        const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
        const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
        const sizes = searchParams.get("sizes")?.split(",") || undefined;
        const sort = searchParams.get("sortBy") || "newest";

        setSortBy(sort); // Sync local sort state

        const data = await getProducts({
          categoryId,
          subcategoryId,
          search,
          minPrice,
          maxPrice,
          sizes,
          sortBy: sort,
        });
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    if (newSort) {
      params.set("sortBy", newSort);
    } else {
      params.delete("sortBy");
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="heading mb-8 text-center uppercase">Shop All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Hidden on mobile by default, shown via sheet/drawer ideally, or simpler for now */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <FilterSidebar categories={categories} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6">
            {/* Mobile Filter Toggle - Placeholder or implementing visible toggle */}
            <div className="md:hidden">
              {/* Mobile filter button can open a sheet/drawer. For now, we can render Sidebar if open, or reuse FilterButton */}
              <FilterButton />
            </div>

            <div className="ml-auto flex items-center">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-black text-white px-4 py-2 pr-8 border border-white cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="bestsellers">Bestsellers</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p>Try adjusting your category or filters.</p>
            </div>
          ) : (
            <ProductCard
              heading=""
              shop={true}
              products={products}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ShopPageContent />
    </Suspense>
  );
};

export default ShopPage;
