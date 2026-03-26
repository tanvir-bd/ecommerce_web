"use server";

import { API_URL } from '@/lib/config';

export async function getProducts(params?: {
    categoryId?: number;
    subcategoryId?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    sortBy?: string;
}) {

    try {
        const queryParams = new URLSearchParams();

        if (params?.categoryId) queryParams.set('categoryId', params.categoryId.toString());
        if (params?.subcategoryId) queryParams.set('subcategoryId', params.subcategoryId.toString());
        if (params?.search) queryParams.set('search', params.search);
        if (params?.minPrice !== undefined) queryParams.set('minPrice', params.minPrice.toString());
        if (params?.maxPrice !== undefined) queryParams.set('maxPrice', params.maxPrice.toString());
        if (params?.sizes && params.sizes.length > 0) queryParams.set('sizes', params.sizes.join(','));
        if (params?.sortBy) queryParams.set('sortBy', params.sortBy);

        const response = await fetch(`${API_URL}/products?${queryParams.toString()}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch Products Error:", error);
        return [];
    }
}

export async function getCategories() {

    try {
        const response = await fetch(`${API_URL}/categories`, {
            cache: 'no-store', // Or force-cache/revalidate as needed
        });

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch Categories Error:", error);
        return [];
    }
}
