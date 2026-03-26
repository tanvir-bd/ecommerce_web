"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { fetchBestsellers } from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { API_URL } from "@/lib/config";

const CartDrawer = () => {
  const {
    items,
    isOpen,
    removeItem,
    updateQuantity,
    openCart,
    closeCart,
  } = useCartStore();

  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

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

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="relative">
      <Sheet open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
        <SheetTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="relative"
            onClick={openCart}
          >
            <ShoppingBag size={24} />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full">
              {items.length}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] max-w-[450px] sm:max-w-[540px] flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="subHeading">CART</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <ShoppingBag size={48} className="mb-2 opacity-20" />
                <p>Your cart is empty</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={closeCart}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  className="flex items-center space-x-4 border-b-2 pb-3"
                  key={item.id}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs sm:text-sm tracking-wide truncate pr-4">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {item.sizeName}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button
                          className="p-1 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="mx-2 text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          className="p-1 hover:bg-gray-100"
                          onClick={() => {
                            if (item.quantity < item.maxStock) {
                              updateQuantity(item.id, item.quantity + 1);
                            } else {
                              toast.error(`Maximum quantity of ${item.maxStock} reached`);
                            }
                          }}
                        // disabled={item.quantity >= item.maxStock} // Allow clicking to show toast
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-semibold text-xs sm:text-base ml-2">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Recommended Products */}
            <div className="mt-8 pt-4 border-t">
              <h3 className="font-semibold text-sm mb-4">You might also like</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {recommendedProducts.map((product) => (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="flex-shrink-0 w-32 group"
                    onClick={closeCart}
                  >
                    <div className="relative aspect-square mb-2 overflow-hidden rounded-md bg-gray-100">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={`${API_BASE_URL}${product.images[0].url}`}
                          alt={product.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <p className="text-xs font-medium truncate">{product.title}</p>
                    <p className="text-xs text-gray-500">
                      {/* Assuming price is available, otherwise hide */}
                      {product.sizes && product.sizes[0] && formatPrice(product.sizes[0].price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-auto border-t bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Subtotal</span>
              <span className="font-bold text-lg">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-center text-gray-500 mb-4">
              Tax included. Shipping calculated at checkout.
            </p>
            <Button
              className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base"
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              CHECKOUT
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CartDrawer;
