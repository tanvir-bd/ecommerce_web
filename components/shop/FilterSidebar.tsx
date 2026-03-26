"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, formatPrice } from "@/lib/utils";

interface Category {
    id: number;
    name: string;
}

interface FilterSidebarProps {
    categories: Category[];
    className?: string;
}

const PRICE_RANGE_MIN = 0;
const PRICE_RANGE_MAX = 10000; // Adjust based on your product prices
const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "100ML", "50ML", "200ML"]; // Example sizes, ideally fetch from DB

export default function FilterSidebar({ categories, className }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [priceRange, setPriceRange] = useState<[number, number]>([
        Number(searchParams.get("minPrice")) || PRICE_RANGE_MIN,
        Number(searchParams.get("maxPrice")) || PRICE_RANGE_MAX,
    ]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(
        searchParams.get("sizes")?.split(",") || []
    );
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        searchParams.get("categoryId")
    );

    // Sync state with URL params when they change externally (e.g. back button)
    useEffect(() => {
        setPriceRange([
            Number(searchParams.get("minPrice")) || PRICE_RANGE_MIN,
            Number(searchParams.get("maxPrice")) || PRICE_RANGE_MAX,
        ]);
        setSelectedSizes(searchParams.get("sizes")?.split(",") || []);
        setSelectedCategory(searchParams.get("categoryId"));
    }, [searchParams]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Update Price
        if (priceRange[0] !== PRICE_RANGE_MIN || priceRange[1] !== PRICE_RANGE_MAX) {
            params.set("minPrice", priceRange[0].toString());
            params.set("maxPrice", priceRange[1].toString());
        } else {
            params.delete("minPrice");
            params.delete("maxPrice");
        }

        // Update Sizes
        if (selectedSizes.length > 0) {
            params.set("sizes", selectedSizes.join(","));
        } else {
            params.delete("sizes");
        }

        // Update Category
        if (selectedCategory) {
            params.set("categoryId", selectedCategory);
        } else {
            params.delete("categoryId");
        }

        router.push(`/shop?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setPriceRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
        setSelectedSizes([]);
        setSelectedCategory(null);
        router.push("/shop");
    };

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    return (
        <div className={cn("w-full md:w-64 space-y-6", className)}>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs h-8">
                    Clear All
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={["category", "price", "size"]}>
                {/* Category Filter */}
                <AccordionItem value="category">
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="cat-all"
                                    checked={!selectedCategory}
                                    onCheckedChange={() => setSelectedCategory(null)}
                                />
                                <Label htmlFor="cat-all" className="cursor-pointer">All Categories</Label>
                            </div>
                            {categories.map((category) => (
                                <div key={category.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`cat-${category.id}`}
                                        checked={selectedCategory === category.id.toString()}
                                        onCheckedChange={() => setSelectedCategory(category.id.toString())}
                                    />
                                    <Label htmlFor={`cat-${category.id}`} className="cursor-pointer">
                                        {category.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Filter */}
                <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-4">
                            <Slider
                                value={priceRange}
                                min={PRICE_RANGE_MIN}
                                max={PRICE_RANGE_MAX}
                                step={100}
                                onValueChange={(value: any) => setPriceRange(value)}
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span>{formatPrice(priceRange[0])}</span>
                                <span>{formatPrice(priceRange[1])}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Size Filter */}
                <AccordionItem value="size">
                    <AccordionTrigger>Size</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-2 gap-2">
                            {AVAILABLE_SIZES.map((size) => (
                                <div key={size} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`size-${size}`}
                                        checked={selectedSizes.includes(size)}
                                        onCheckedChange={() => toggleSize(size)}
                                    />
                                    <Label htmlFor={`size-${size}`} className="cursor-pointer">
                                        {size}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Button onClick={handleApplyFilters} className="w-full bg-black text-white hover:bg-gray-800">
                Apply Filters
            </Button>
        </div>
    );
}
