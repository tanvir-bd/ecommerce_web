"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

interface QuantitySelectorProps {
    quantity: number;
    maxQuantity: number;
    onQuantityChange: (quantity: number) => void;
}

const QuantitySelector = ({
    quantity,
    maxQuantity,
    onQuantityChange,
}: QuantitySelectorProps) => {
    const handleIncrement = () => {
        if (quantity < maxQuantity) {
            onQuantityChange(quantity + 1);
        } else {
            toast.error(`Maximum quantity of ${maxQuantity} reached`);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    return (
        <div className="flex items-center gap-0">
            <Button
                variant={"outline"}
                className="bg-[#F2F2F2]"
                size={"icon"}
                onClick={handleDecrement}
                disabled={quantity <= 1}
            >
                <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center border-y-2 py-[6px]">{quantity}</span>
            <Button
                variant={"outline"}
                className="bg-[#F2F2F2]"
                size={"icon"}
                onClick={handleIncrement}
            // disabled={quantity >= maxQuantity} // Allow clicking to show toast
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default QuantitySelector;
