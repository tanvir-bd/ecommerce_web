"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { toast } from "sonner";
import { Star, Clock, Award, Droplet, MapPin, Heart } from "lucide-react";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { API_URL } from "@/lib/config";

interface Size {
    id: number;
    size: string;
    price: string;
    quantity: number;
}

interface Product {
    id: number;
    title: string;
    description?: string;
    discount?: string;
    category?: { name: string };
    subcategory?: { name: string };
    sizes: Size[];
    images?: { url: string }[];
}

interface ProductInfoProps {
    product: Product;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [quantity, setQuantity] = useState(1);

    // API Base URL
    const API_BASE_URL = API_URL;

    // Auto-select first available size
    useEffect(() => {
        if (product.sizes && product.sizes.length > 0) {
            const firstAvailableSize = product.sizes.find((s) => s.quantity > 0);
            if (firstAvailableSize) {
                setSelectedSize(firstAvailableSize);
            }
        }
    }, [product.sizes]);

    const handleSizeChange = (size: Size) => {
        setSelectedSize(size);
        setQuantity(1); // Reset quantity when size changes
    };

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
    };

    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addFavorite, removeItem: removeFavorite, isFavorite } = useFavoritesStore();

    // Check if current selection is in favorites
    const isCurrentFavorite = selectedSize ? isFavorite(product.id, selectedSize.id) : false;

    const handleToggleFavorite = () => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }

        const uniqueId = `${product.id}_${selectedSize.id}`;

        if (isCurrentFavorite) {
            removeFavorite(uniqueId);
            toast.info("Removed from favorites");
        } else {
            const imageUrl = product.images?.[0]?.url
                ? `${API_BASE_URL}${product.images[0].url}`
                : "";

            addFavorite({
                id: uniqueId,
                productId: product.id,
                sizeId: selectedSize.id,
                sizeName: selectedSize.size,
                name: product.title,
                price: parseFloat(selectedSize.price),
                image: imageUrl,
                maxStock: selectedSize.quantity,
                description: product.description,
                quantity: quantity // Add selected quantity
            });
            toast.success("Added to favorites");
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }

        const imageUrl = product.images?.[0]?.url
            ? `${API_BASE_URL}${product.images[0].url}`
            : "";

        const added = addItem({
            productId: product.id,
            sizeId: selectedSize.id,
            sizeName: selectedSize.size,
            name: product.title,
            price: parseFloat(selectedSize.price),
            quantity: quantity,
            image: imageUrl,
            maxStock: selectedSize.quantity,
        });

        if (added) {
            toast.success(`Added ${quantity} item(s) to cart!`);
        } else {
            toast.error(`Maximum quantity of ${selectedSize.quantity} reached in cart`);
        }
    };

    // Calculate prices
    const currentPrice = selectedSize ? parseFloat(selectedSize.price) : 0;
    const discount = product.discount ? parseFloat(product.discount) : 0;
    const originalPrice = discount > 0 ? currentPrice / (1 - discount / 100) : currentPrice;

    // Calculate average rating (placeholder - will be dynamic when reviews are added)
    const averageRating = 4.4;
    const totalReviews: number = 0; // Will be dynamic

    return (
        <div className="w-full lg:w-1/2 space-y-4">
            {/* Product Title */}
            <h1 className="text-2xl lg:subHeading">{product.title}</h1>

            {/* Product Category */}
            <p className="text-xs lg:text-sm text-gray-500">
                {product.category?.name || product.subcategory?.name || ""}
            </p>

            {/* Product Description */}
            {product.description && (
                <p className="text-sm text-gray-600">{product.description}</p>
            )}

            {/* Product Rating */}
            <div className="flex items-center gap-2">
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(averageRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                                }`}
                        />
                    ))}
                </div>
                <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">
                    ({totalReviews} {totalReviews === 1 ? "Review" : "Reviews"})
                </span>
            </div>

            {/* Pricing Information */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4">
                <div className="mb-4 lg:mb-0">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl lg:text-3xl font-bold">
                            {formatPrice(currentPrice)}
                        </span>
                        {discount > 0 && (
                            <>
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(originalPrice)}
                                </span>
                                <span className="text-red-500 font-semibold">
                                    -{discount.toFixed(0)}%
                                </span>
                            </>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                </div>
            </div>

            {/* Size Selector */}
            <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSizeChange={handleSizeChange}
            />

            {/* Quantity Selector */}
            {selectedSize && selectedSize.quantity > 0 && (
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium">Quantity:</label>
                    </div>
                    <QuantitySelector
                        quantity={quantity}
                        maxQuantity={selectedSize.quantity}
                        onQuantityChange={handleQuantityChange}
                    />
                </div>
            )}

            {/* Add to Cart & Favorites Buttons */}
            <div className="flex gap-4">
                <Button
                    className="flex-1 bg-black text-white gap-4 py-7"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || selectedSize.quantity === 0}
                >
                    {!selectedSize
                        ? "SELECT A SIZE"
                        : selectedSize.quantity === 0
                            ? "OUT OF STOCK"
                            : "ADD TO CART"}
                </Button>

                <Button
                    variant="outline"
                    className="py-7 px-4 border-black"
                    onClick={handleToggleFavorite}
                    disabled={!selectedSize}
                    title={!selectedSize ? "Select a size first" : "Add to Favorites"}
                >
                    <Heart
                        className={`w-6 h-6 ${isCurrentFavorite ? "fill-black text-black" : "text-black"}`}
                    />
                </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {[
                    { icon: Clock, text: "LONG-LASTING" },
                    { icon: Award, text: "CERTIFIED" },
                    { icon: Droplet, text: "QUALITY CHECKED OILS" },
                    { icon: MapPin, text: "MADE IN INDIA" },
                ].map(({ icon: Icon, text }, index) => (
                    <div
                        className="flex flex-col items-center text-center bg-gray-100 px-1 py-8 justify-center"
                        key={index}
                    >
                        <div className="rounded-full">
                            <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs mt-2">{text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductInfo;
