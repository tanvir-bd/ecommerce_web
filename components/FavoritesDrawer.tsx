"use client";

import { useState, useEffect } from "react";

import { Button } from "./ui/button";
import { Heart, ShoppingBag, X, Plus } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { fetchBestsellers } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { API_URL } from "@/lib/config";

const FavoritesDrawer = () => {
    const {
        items,
        isOpen,
        removeItem,
        openFavorites,
        closeFavorites,
    } = useFavoritesStore();

    const addItemToCart = useCartStore((state) => state.addItem);
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

    const API_BASE_URL = API_URL;

    useEffect(() => {
        const loadRecommended = async () => {
            try {
                const products = await fetchBestsellers(4);
                setRecommendedProducts(products);
            } catch (error) {
                console.error("Failed to fetch recommended products", error);
            }
        };
        loadRecommended();
    }, []);

    const handleAddToCart = (item: any) => {
        const added = addItemToCart({
            productId: item.productId,
            sizeId: item.sizeId,
            sizeName: item.sizeName,
            name: item.name,
            price: item.price,
            quantity: 1, // Default to 1
            image: item.image,
            maxStock: item.maxStock,
        });

        if (added) {
            toast.success(`Added ${item.name} to cart!`);
            removeItem(item.id);
        } else {
            toast.error(`Could not add to cart (Max limit reached)`);
        }
    };

    const handleAddAllToCart = () => {
        let addedCount = 0;
        items.forEach(item => {
            const added = addItemToCart({
                productId: item.productId,
                sizeId: item.sizeId,
                sizeName: item.sizeName,
                name: item.name,
                price: item.price,
                quantity: 1,
                image: item.image,
                maxStock: item.maxStock,
            });
            if (added) addedCount++;
        });

        if (addedCount > 0) {
            toast.success(`Added ${addedCount} items to cart!`);
            closeFavorites();
        } else {
            toast.error("Could not add items (Check stock or cart limits)");
        }
    };

    return (
        <div className="relative">
            <Sheet open={isOpen} onOpenChange={(open) => open ? openFavorites() : closeFavorites()}>
                <SheetTrigger asChild>
                    <div />
                </SheetTrigger>
                <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px] flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle className="subHeading flex items-center gap-2">
                            FAVORITES <Heart className="w-4 h-4 fill-black" />
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-gray-500 text-center">
                                    Your favorites list is empty
                                </p>
                                <Button
                                    className="mt-4 bg-black text-white hover:bg-gray-800"
                                    onClick={closeFavorites}
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    className="flex items-start space-x-4 border-b pb-4"
                                    key={item.id}
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        <img
                                            src={
                                                item.image?.startsWith("http")
                                                    ? item.image
                                                    : item.image?.startsWith("/")
                                                        ? `${API_BASE_URL}${item.image}`
                                                        : "/placeholder.svg"
                                            }
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    {/* Middle: Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                                        <div>
                                            <Link href={`/product/${item.productId}`} onClick={closeFavorites}>
                                                <h3 className="font-semibold text-sm truncate hover:underline">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Size: {item.sizeName}
                                            </p>
                                        </div>
                                        <div className="mt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs flex items-center gap-1 px-3"
                                                onClick={() => handleAddToCart(item)}
                                            >
                                                <Plus className="w-3 h-3" /> Add to Cart
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Right: Close & Price */}
                                    <div className="flex flex-col justify-between items-end h-20">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <p className="font-semibold text-sm">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Recommended Products */}
                        {recommendedProducts.length > 0 && (
                            <div className="mt-8 pt-4 border-t">
                                <h3 className="font-semibold text-sm mb-4">You might also like</h3>
                                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                                    {recommendedProducts.map((product) => (
                                        <Link
                                            href={`/product/${product.id}`}
                                            key={product.id}
                                            className="flex-shrink-0 w-32 group"
                                            onClick={closeFavorites}
                                        >
                                            <div className="relative aspect-square mb-2 overflow-hidden rounded-md bg-gray-100">
                                                {product.images && product.images.length > 0 && (
                                                    <img
                                                        src={
                                                            product.images[0].url.startsWith("http")
                                                                ? product.images[0].url
                                                                : `${API_BASE_URL}${product.images[0].url}`
                                                        }
                                                        alt={product.title}
                                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-xs font-medium truncate">{product.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {product.sizes && product.sizes[0] && formatPrice(product.sizes[0].price)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="pt-4 mt-auto border-t bg-white">
                            <Button
                                className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base"
                                onClick={handleAddAllToCart}
                            >
                                ADD ALL TO CART
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default FavoritesDrawer;
