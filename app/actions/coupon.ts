"use server";

import { API_URL } from '@/lib/config';

export async function validateCoupon(code: string) {

    try {
        const response = await fetch(`${API_URL}/coupons/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.valid) {
            return {
                valid: true,
                discountPercent: data.discountPercent,
                code: data.code,
            };
        } else {
            return {
                valid: false,
                message: data.message || "Invalid coupon",
            };
        }
    } catch (error: any) {
        console.error("Validate Coupon Error:", error);
        return {
            valid: false,
            message: "Failed to validate coupon",
        };
    }
}
