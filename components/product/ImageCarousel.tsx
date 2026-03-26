"use client";

import React, { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

interface ImageCarouselProps {
    images: Array<{ id: number; url: string }>;
    productTitle: string;
    apiBaseUrl: string;
}

const ImageCarousel = ({ images, productTitle, apiBaseUrl }: ImageCarouselProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                <p className="text-gray-400">No image available</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Main Image Display */}
            <div className="w-full">
                <img
                    src={`${apiBaseUrl}${images[selectedIndex].url}`}
                    alt={`${productTitle} - Image ${selectedIndex + 1}`}
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden transition-all ${selectedIndex === index
                                    ? "border-black"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                        >
                            <img
                                src={`${apiBaseUrl}${image.url}`}
                                alt={`${productTitle} - Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageCarousel;
