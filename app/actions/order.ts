"use server";

import { API_URL } from '@/lib/config';

export async function createOrder(orderData: any) {

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create order");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Create Order Error:", error);
        throw new Error(error.message || "Failed to create order");
    }
}

export async function getOrderById(orderId: number) {

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch order");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Get Order Error:", error);
        return null;
    }
}
