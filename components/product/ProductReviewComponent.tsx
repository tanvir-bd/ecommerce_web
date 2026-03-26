"use client";

import { ChevronDown, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import Link from "next/link";

interface Review {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  verified: boolean;
  createdAt: string;
}

interface ProductReviewComponentProps {
  reviews?: Review[];
  productId: number;
}

const ProductReviewComponent = ({ reviews = [], productId }: ProductReviewComponentProps) => {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [formData, setFormData] = useState({
    rating: "",
    review: "",
    title: "",
  });
  const [errors, setErrors] = useState({
    rating: "",
    review: "",
    title: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      rating: formData.rating ? "" : "Rating is required.",
      review: formData.review.trim().length > 0 ? "" : "Review cannot be empty.",
      title: formData.title ? "" : "Title is required.",
    };

    setErrors(newErrors);

    // If no errors, submit the form
    if (!newErrors.rating && !newErrors.review && !newErrors.title) {
      console.log("Form submitted:", formData);
      // TODO: Send to backend
      // Reset form
      setFormData({ rating: "", review: "", title: "" });
    }
  };

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const ratingBreakDown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, percentage, count };
  });

  return (
    <div className="ownContainer p-4 mt-[20px]">
      <h2 className="heading">Customer Reviews</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${star <= Math.round(averageRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
                  }`}
              />
            ))}
            <span className="ml-2 text-xl font-semibold">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
          {ratingBreakDown.map((rating) => (
            <div key={rating.stars} className="flex items-center mb-2">
              <div className="flex items-center w-24">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating.stars
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                <div
                  className="bg-yellow-400 h-2.5 rounded-full"
                  style={{ width: `${rating.percentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 w-12">
                {rating.percentage}%
              </span>
              <span className="ml-2 text-sm text-gray-600 w-12">
                ({rating.count})
              </span>
            </div>
          ))}
          <Link href={"/review"}>
            <button className="text-sm text-blue-600 mt-2">
              See all reviews
            </button>
          </Link>
        </div>
        <div className="md:w-2/3">
          <div className="flex justify-between mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Leave a Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h2>Submit Your Review</h2>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                  {/* Rating Select */}
                  <div style={{ marginBottom: "1rem" }}>
                    <Select
                      onValueChange={(value) =>
                        setFormData({ ...formData, rating: value })
                      }
                      value={formData.rating}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Rating</SelectLabel>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.rating && (
                      <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                    )}
                  </div>

                  {/* Review Textarea */}
                  <div style={{ marginBottom: "1rem" }}>
                    <Textarea
                      placeholder="Write your review here"
                      value={formData.review}
                      onChange={(e) =>
                        setFormData({ ...formData, review: e.target.value })
                      }
                    />
                    {errors.review && (
                      <p className="text-red-500 text-sm mt-1">{errors.review}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <DialogFooter>
                    <Button type="submit">Submit Review</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border rounded py-2 px-4 pr-8 leading-tight focus:outline focus:border-blue-500"
              >
                {" "}
                <option>Most Recent</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            {totalReviews === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
                <p className="text-gray-400 text-sm">Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold mr-3">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">{review.userName}</span>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewComponent;
