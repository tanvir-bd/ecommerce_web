"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Topbar {
    id: number;
    title: string;
    textColor: string;
    backgroundColor: string;
    link: string;
    hasButton: boolean;
    buttonText?: string;
    buttonTextColor?: string;
    buttonBackgroundColor?: string;
    buttonLink?: string;
}

export default function Topbar() {
    const [topbars, setTopbars] = useState<Topbar[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchTopbars = async () => {
            try {
                const response = await fetch(`${API_URL}/topbars/active`);
                if (response.ok) {
                    const data = await response.json();
                    setTopbars(data);
                }
            } catch (error) {
                console.error("Failed to fetch topbars:", error);
            }
        };

        fetchTopbars();
    }, []);

    useEffect(() => {
        if (topbars.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % topbars.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [topbars.length]);

    if (topbars.length === 0 || !isVisible) return null;

    const currentTopbar = topbars[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % topbars.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + topbars.length) % topbars.length);
    };

    return (
        <div
            className="relative w-full px-4 py-2 transition-colors duration-300"
            style={{
                backgroundColor: currentTopbar.backgroundColor,
                color: currentTopbar.textColor,
            }}
        >
            <div className="container mx-auto flex items-center justify-center relative">
                {/* Navigation Arrows (only if multiple topbars) */}
                {topbars.length > 1 && (
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 p-1 hover:opacity-75 transition-opacity"
                        aria-label="Previous announcement"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}

                {/* Content */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left text-sm font-medium">
                    <Link href={currentTopbar.link} className="hover:underline">
                        {currentTopbar.title}
                    </Link>

                    {currentTopbar.hasButton && currentTopbar.buttonText && (
                        <Link
                            href={currentTopbar.buttonLink || "#"}
                            className="px-3 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105"
                            style={{
                                backgroundColor: currentTopbar.buttonBackgroundColor,
                                color: currentTopbar.buttonTextColor,
                            }}
                        >
                            {currentTopbar.buttonText}
                        </Link>
                    )}
                </div>

                {/* Navigation Arrows (only if multiple topbars) */}
                {topbars.length > 1 && (
                    <button
                        onClick={handleNext}
                        className="absolute right-0 p-1 hover:opacity-75 transition-opacity"
                        aria-label="Next announcement"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
