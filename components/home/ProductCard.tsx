import { Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount?: number;
  isBestseller?: boolean;
  isSale?: boolean;
}

interface BackendProduct {
  id: number;
  title: string;
  discount: number | null;
  category: { name: string } | null;
  subcategory: { name: string } | null;
  images: Array<{ url: string }>;
  sizes: Array<{ price: string; size: string; quantity: number }>;
  sold: number;
}

const Card = ({ product, shop }: { product: Product; shop?: boolean }) => {
  return (
    <div className="w-full flex-shrink-0 mb-2">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover mb-4"
          />
        </Link>
        <div className="absolute top-2 left-2 flex gap-2">
          {product.isBestseller && (
            <span className="bg-[#E1B87F] text-white text-xs font-semibold px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}
          {product.isSale && (
            <span className="bg-[#7EBFAE] text-white text-xs font-semibold px-2 py-1 rounded">
              SALE
            </span>
          )}
        </div>
        {product.discount && (
          <span className="absolute bottom-2 left-2 bg-[#7EBFAE] text-white text-xs font-semibold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mb-1 textGap text-[10px]">
        {product.category.length > 25
          ? product.category.substring(0, 25) + "..."
          : product.category}
      </div>
      <h3 className="font-semibold text-sm mb-2 textGap">
        {product.name.length > 25
          ? product.name.substring(0, 25) + "..."
          : product.name}
      </h3>
      <div className="flex items-center mb-2">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-semibold ml-1">{product.rating}</span>
        <span className="text-xs text-gray-500 ml-2">
          ({product.reviews} Reviews)
        </span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold">{formatPrice(product.price)}</span>
        <span className="text-gray-500 line-through text-sm">
          {formatPrice(product.originalPrice)}
        </span>
      </div>
      {!shop && (
        <Link href={`/product/${product.id}`}>
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            VIEW PRODUCT
          </Button>
        </Link>
      )}
    </div>
  );
};

import { API_URL } from "@/lib/config";

const ProductCard = ({
  heading,
  shop,
  products: backendProducts,
  categoryId,
  excludeProductId,
}: {
  heading: string;
  shop?: boolean;
  products?: BackendProduct[];
  categoryId?: number;
  excludeProductId?: number;
}) => {
  const API_BASE_URL = API_URL;

  // Map backend products to frontend Product interface
  const products: Product[] = backendProducts
    ? backendProducts.map((p) => {
      const minPrice = p.sizes.length > 0
        ? Math.min(...p.sizes.map(s => parseFloat(s.price)))
        : 0;
      const originalPrice = p.discount
        ? minPrice / (1 - parseFloat(p.discount.toString()) / 100)
        : minPrice;

      return {
        id: p.id.toString(),
        name: p.title,
        category: p.category?.name || p.subcategory?.name || '',
        image: p.images.length > 0 ? `${API_BASE_URL}${p.images[0].url}` : '',
        rating: 4.7, // Default rating - could be enhanced with actual ratings
        reviews: Math.floor(Math.random() * 1000) + 100, // Random reviews - could be enhanced
        price: minPrice,
        originalPrice: originalPrice,
        discount: p.discount ? parseFloat(p.discount.toString()) : undefined,
        isBestseller: p.sold > 0,
        isSale: p.discount ? parseFloat(p.discount.toString()) > 20 : false,
      };
    })
    : [];

  return (
    <div className="container mx-auto mb-[20px]">
      {shop ? null : (
        <div className="flex justify-center">
          <div className="heading ownContainer uppercase sm:my-[40px]">
            {heading}
          </div>
        </div>
      )}
      <div className="relative">
        <div
          className={`${shop
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4"
            } mb-8`}
        >
          {products.map((product) => (
            <Card key={product.id} product={product} shop={shop} />
          ))}
        </div>
      </div>
      {!shop && (
        <div className="flex justify-center mt-8">
          <Button
            variant={"outline"}
            className="w-[90%] sm:w-[347px] border-2 border-black textGap px-[10px] py-[20px]"
          >
            VIEW ALL
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
