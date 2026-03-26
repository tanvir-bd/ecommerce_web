"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, Loader2 } from "lucide-react";
import { fetchBestsellers, searchProducts } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/lib/config";

const API_BASE_URL = API_URL;

interface Product {
  id: number;
  title: string;
  discount?: string;
  sizes: Array<{ price: string }>;
  images: Array<{ url: string }>;
}

const SearchModal = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"recommended" | "searching" | "results" | "no-results">("recommended");

  const trendingSearches = [
    "Perfume",
    "Bath & Body",
    "Gifting",
    "Crazy Deals",
    "Combos",
  ];

  // Fetch bestsellers on mount
  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const products = await fetchBestsellers(4);
        setRecommendedProducts(products);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };
    loadRecommended();
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setMode("recommended");
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setMode("searching");

    try {
      const results = await searchProducts(query);
      setSearchResults(results);
      setMode(results.length > 0 ? "results" : "no-results");
    } catch (error) {
      console.error("Error searching products:", error);
      setMode("no-results");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // Handle trending search click
  const handleTrendingClick = (search: string) => {
    setSearchQuery(search);
  };

  // Calculate product price and discount
  const getProductPrice = (product: Product) => {
    const minPrice = product.sizes.length > 0
      ? Math.min(...product.sizes.map((s) => parseFloat(s.price)))
      : 0;
    const discount = product.discount ? parseFloat(product.discount) : 0;
    const originalPrice = discount > 0 ? minPrice / (1 - discount / 100) : minPrice;
    return { price: minPrice, originalPrice, discount };
  };

  // Render product card
  const renderProductCard = (product: Product) => {
    const { price, originalPrice, discount } = getProductPrice(product);
    const imageUrl = product.images[0]?.url
      ? `${API_BASE_URL}${product.images[0].url}`
      : "https://placehold.co/200x200";

    return (
      <Link
        key={product.id}
        href={`/product/${product.id}`}
        onClick={() => setOpen(false)}
        className="space-y-2 min-w-[110px] flex-shrink-0 sm:min-w-0 block"
      >
        <div className="aspect-square relative">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover rounded-none"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              {Math.round(discount)}% OFF
            </span>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-sm line-clamp-2">{product.title}</h4>
          <div className="flex items-baseline gap-2">
            <span className="font-bold">{formatPrice(price)}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <Dialog>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl mx-4 md:mx-6 lg:mx-auto p-4 sm:p-6 bg-background rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Input
            type="search"
            placeholder="Search for products..."
            className="w-full mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search) => (
                <Button
                  key={search}
                  type="button"
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => handleTrendingClick(search)}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          <div>
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}

            {mode === "recommended" && !isLoading && (
              <>
                <h3 className="text-sm font-semibold mb-2">Recommended for you</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:space-x-0 sm:gap-2">
                  {recommendedProducts.map((product) => renderProductCard(product))}
                </div>
              </>
            )}

            {mode === "results" && !isLoading && (
              <>
                <h3 className="text-sm font-semibold mb-2">
                  Search Results ({searchResults.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {searchResults.map((product) => renderProductCard(product))}
                </div>
              </>
            )}

            {mode === "no-results" && !isLoading && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No products found</p>
                <p className="text-sm text-gray-400">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchModal;
