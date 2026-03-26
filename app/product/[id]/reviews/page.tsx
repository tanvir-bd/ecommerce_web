import React from "react";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductReviews } from "@/app/actions/review";
import { fetchProductById } from "@/lib/api";
import { notFound } from "next/navigation";
import { API_URL } from "@/lib/config";

interface PageProps {
    params: {
        id: string;
    }
}

const ProductReviewsPage = async ({ params }: PageProps) => {
    // Await params for Next.js 15+
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id, 10);

    if (isNaN(productId)) notFound();

    const [product, reviews] = await Promise.all([
        fetchProductById(productId),
        getProductReviews(productId)
    ]);

    if (!product) notFound();

    const API_BASE_URL = API_URL;

    const getImageUrl = (url: string) => {
        if (url.startsWith("http")) return url;
        return `${API_BASE_URL}${url}`;
    };

    // Calculate rating stats
    const totalReviews = reviews.length;
    let averageRating = product.rating || 0;
    // Or calculate from current reviews if we want only verified ones shown here to match
    // Ideally product.rating should be synced by backend.

    // Calculate counts for each star
    const ratingCounts = {
        5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    } as any;

    reviews.forEach((r: any) => {
        const rating = Math.round(r.rating);
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating]++;
        }
    });

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Product Info & Stats */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="p-6 sticky top-6">
                            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
                                {product.images && product.images.length > 0 && (
                                    <Image
                                        src={getImageUrl(product.images[0].url)}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <h1 className="text-xl font-bold mb-2">{product.title}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                                <span className="text-gray-500">({totalReviews} reviews)</span>
                            </div>

                            {/* Rating Breakdown */}
                            <div className="space-y-2 mt-6">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="w-3 text-sm">{rating}</span>
                                        <Star className="w-4 h-4 text-gray-400" />
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400"
                                                style={{
                                                    width: `${totalReviews > 0 ? (ratingCounts[rating] / totalReviews) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 w-8">{ratingCounts[rating]}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Reviews List */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                            {reviews.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No reviews yet. Be the first to review this product!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review: any) => (
                                        <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
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
                                                        <span className="font-semibold">{review.user?.username || 'Anonymous'}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviewsPage;
