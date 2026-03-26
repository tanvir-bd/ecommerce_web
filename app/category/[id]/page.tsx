import { fetchSubcategoryById, fetchProductsBySubcategory, fetchAllProducts } from "@/lib/api";
import ProductCard from "@/components/home/ProductCard";
import { notFound } from "next/navigation";

// Define PageProps type compatible with Next.js 15+
type Params = Promise<{ id: string }>;

export default async function CategoryPage({ params }: { params: Params }) {
    const { id } = await params;
    const subcategoryId = parseInt(id, 10);

    if (isNaN(subcategoryId)) {
        notFound();
    }

    let subcategory: { id: number; name: string } | null = null;
    let products = [];

    try {
        // 1. Fetch subcategory details first
        subcategory = await fetchSubcategoryById(subcategoryId).catch(() => null);

        if (!subcategory) {
            notFound();
        }

        // 2. Fetch products based on category name
        if (subcategory.name.toLowerCase() === 'all') {
            products = await fetchAllProducts().catch(() => []);
        } else {
            products = await fetchProductsBySubcategory(subcategoryId).catch(() => []);
        }

    } catch (error) {
        console.error("Error fetching category page data:", error);
        // Continue rendering with empty products if fetch fails, or 404 if subcategory failed
        if (!subcategory) notFound();
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
                        {subcategory!.name}
                    </h1>
                    <p className="text-gray-500">
                        {products.length} {products.length === 1 ? "Product" : "Products"} Found
                    </p>
                </div>

                {products.length > 0 ? (
                    <ProductCard
                        heading=""
                        products={products}
                        shop={true} // Using shop layout (grid)
                    />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500">No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
