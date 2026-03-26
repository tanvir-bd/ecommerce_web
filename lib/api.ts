import { API_URL } from "./config";

const API_BASE_URL = API_URL;

export async function fetchBestsellers(limit: number = 8) {
    const res = await fetch(`${API_BASE_URL}/products/bestsellers?limit=${limit}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch bestsellers');
    return res.json();
}

export async function fetchNewArrivals(limit: number = 8) {
    const res = await fetch(`${API_BASE_URL}/products/new-arrivals?limit=${limit}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch new arrivals');
    return res.json();
}

export async function fetchOffersByType(type: string) {
    const res = await fetch(`${API_BASE_URL}/offers/type/${type}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Failed to fetch offers of type ${type}`);
    return res.json();
}

export async function fetchAllSubcategories() {
    const res = await fetch(`${API_BASE_URL}/subcategories`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch subcategories');
    return res.json();
}

export async function fetchProductById(id: number) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

export async function fetchRelatedProducts(categoryId: number, limit: number = 8) {
    const res = await fetch(`${API_BASE_URL}/products?categoryId=${categoryId}&limit=${limit}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch related products');
    return res.json();
}

export async function searchProducts(query: string) {
    const res = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(query)}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to search products');
    return res.json();
}

export async function fetchSubcategoryById(id: number) {
    const res = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch subcategory');
    return res.json();
}

export async function fetchProductsBySubcategory(subcategoryId: number) {
    const res = await fetch(`${API_BASE_URL}/products?subcategoryId=${subcategoryId}`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch products by subcategory');
    return res.json();
}

export async function fetchAllProducts() {
    const res = await fetch(`${API_BASE_URL}/products`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch all products');
    return res.json();
}
