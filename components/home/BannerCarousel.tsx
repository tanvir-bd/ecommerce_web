"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

import { API_URL } from "@/lib/config";

interface Banner {
  id: number;
  imageUrl: string;
}

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const apiUrl = API_URL;
        const response = await fetch(`${apiUrl}/website-banners`);
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Fallback to default images if API fails
        setBanners([
          { id: 1, imageUrl: "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727399729/pixelcut-export_smh3fv.png" },
          { id: 2, imageUrl: "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727399729/pixelcut-export_2_ze8uvi.png" },
          { id: 3, imageUrl: "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727399729/pixelcut-export_3_ovaqca.png" },
          { id: 4, imageUrl: "https://res.cloudinary.com/dtxh3ew7s/image/upload/v1727399728/pixelcut-export_1_focyqi.png" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 485);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const interval = setInterval(nextSlide, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [banners.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden mb-[20px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden mb-[20px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No banners available</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${isMobile ? "h-[400px]" : "h-[400px]"
        } overflow-hidden mb-[20px]`}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={`${API_URL}${banner.imageUrl}`}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black rounded-none"
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black rounded-none"
      >
        <ChevronRight size={24} />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
