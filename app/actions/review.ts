'use server'

import { revalidatePath } from "next/cache";

import { API_URL } from '@/lib/config';

const API_BASE_URL = API_URL;

export async function createReview(data: { productId: number; userId: number; rating: number; comment: string }) {
    try {
        const res = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            return { success: false, message: error.message || 'Failed to submit review' };
        }

        return { success: true, message: 'Review submitted successfully! It will be visible after approval.' };
    } catch (error) {
        console.error('Create Review Error:', error);
        return { success: false, message: 'Something went wrong.' };
    }
}

export async function getProductReviews(productId: number) {
    try {
        const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error('Get Reviews Error:', error);
        return [];
    }
}
