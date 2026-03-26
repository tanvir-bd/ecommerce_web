import React from "react";
import Marquee from "react-fast-marquee";
import ProductCard from "@/components/home/ProductCard";
import ProductReviewComponent from "@/components/product/ProductReviewComponent";
import ProductDetailsAccordian from "@/components/product/ProductDetailsAccordian";
import ImageCarousel from "@/components/product/ImageCarousel";
import ProductInfo from "@/components/product/ProductInfo";
import { fetchProductById } from "@/lib/api";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReviewDialog from "@/components/reviews/ReviewDialog";
import { Star } from "lucide-react";
import { getProductReviews } from "@/app/actions/review";
import { formatPrice } from "@/lib/utils";
import { API_URL } from "@/lib/config";

const API_BASE_URL = API_URL;

interface PageProps {
    params: {
        id: string;
    };
}

// ... existing imports ...

// Server component that fetches product data
const ProductPage = async ({ params }: PageProps) => {
    // Await params for Next.js 15+
    const { id } = await params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
        notFound();
    }

    let product;
    try {
        product = await fetchProductById(productId);
        if (!product) {
            notFound();
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
    }

    // Fetch reviews
    const allReviews = await getProductReviews(productId);
    const recentReviews = allReviews.slice(0, 3); // Take top 3

    // Check auth
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId");

    // Fetch related products from the same category
    let relatedProducts: any[] = [];
    if (product.categoryId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/products?categoryId=${product.categoryId}&limit=8`,
                { cache: 'no-store' }
            );
            if (response.ok) {
                const allProducts = await response.json();
                // Filter out the current product
                relatedProducts = allProducts.filter((p: any) => p.id !== productId);
            }
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    }

    return (
        <div>
            {/* Announcement Marquee: Displays promotional offers and shipping information */}
            <Marquee className="bg-[#FFF579] flex justify-between gap-[50px] p-4 sm:hidden">
                <p className="para mx-4">✨ Free delivery on all PrePaid Orders</p>
                <p className="para mx-4">
                    🎁 Buy Any 3 products and get 1 gift for free
                </p>
                <p className="para mx-4">
                    1 Body wash cleanser + 5 SKINCARE PRODUCTS @ {formatPrice(1500)}
                </p>
            </Marquee>

            {/* Main container: Product details section */}
            <div className="max-w-7xl ownContainer pb-6 px-6 pt-2">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-[20px]">
                    {/* Product Image Carousel with Thumbnails */}
                    <div className="w-full lg:w-1/2">
                        <ImageCarousel
                            images={product.images || []}
                            productTitle={product.title}
                            apiBaseUrl={API_BASE_URL}
                        />
                    </div>

                    {/* Product Information: Interactive client component */}
                    <ProductInfo product={product} />
                </div>

                {/* Product Details Accordion: Expands to show more detailed information */}
                <ProductDetailsAccordian
                    longDescription={product.longDescription}
                    benefits={product.benefits}
                    ingredients={product.ingredients}
                />

                {/* Reviews Section */}
                <div className="mt-10 border-t pt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        <div className="flex gap-4">
                            <Link href={`/product/${productId}/reviews`}>
                                <Button variant="outline">View All Reviews</Button>
                            </Link>
                            {userId ? (
                                <ReviewDialog productId={productId} userId={parseInt(userId.value)} />
                            ) : (
                                <Link href="/login">
                                    <Button>Login to Review</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {recentReviews.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {recentReviews.map((review: any) => (
                                <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-semibold text-sm">{review.user?.username || 'Anonymous'}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-3">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No reviews yet.</p>
                    )}
                </div>

                {/* Related Products Section: Suggests additional products */}
                {relatedProducts.length > 0 && (
                    <ProductCard
                        heading="YOU MAY ALSO LIKE"
                        products={relatedProducts}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductPage;
