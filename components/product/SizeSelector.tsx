"use client";

import React from "react";

interface Size {
    id: number;
    size: string;
    price: string;
    quantity: number;
}

interface SizeSelectorProps {
    sizes: Size[];
    selectedSize: Size | null;
    onSizeChange: (size: Size) => void;
}

const SizeSelector = ({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) => {
    if (!sizes || sizes.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Select Size:</label>
            <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                    <button
                        key={size.id}
                        onClick={() => onSizeChange(size)}
                        disabled={size.quantity === 0}
                        className={`px-4 py-2 border rounded-md transition-colors ${selectedSize?.id === size.id
                                ? "bg-black text-white border-black"
                                : size.quantity === 0
                                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "bg-white text-black border-gray-300 hover:border-black"
                            }`}
                    >
                        {size.size}
                        {size.quantity === 0 && (
                            <span className="block text-xs">Out of Stock</span>
                        )}
                    </button>
                ))}
            </div>
            {selectedSize && (
                <p className="text-sm text-gray-600">
                    {selectedSize.quantity > 0 && selectedSize.quantity <= 10 && (
                        <span className="text-orange-600">
                            Only {selectedSize.quantity} left in stock!
                        </span>
                    )}
                </p>
            )}
        </div>
    );
};

export default SizeSelector;
