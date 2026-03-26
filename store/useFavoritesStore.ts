import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FavoriteItem {
    id: string; // Unique ID: productId_sizeId
    productId: number;
    sizeId: number;
    sizeName: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    maxStock: number; // To check stock when adding to cart
    quantity: number;
}

interface FavoritesState {
    items: FavoriteItem[];
    isOpen: boolean;
    addItem: (item: FavoriteItem) => boolean;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearFavorites: () => void;
    openFavorites: () => void;
    closeFavorites: () => void;
    toggleFavorites: () => void;
    isFavorite: (productId: number, sizeId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (newItem) => {
                const state = get();
                const existingItem = state.items.find((item) => item.id === newItem.id);

                if (existingItem) {
                    // Update quantity if item exists
                    set({
                        items: state.items.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        ),
                        isOpen: true,
                    });
                    return true;
                }

                set({
                    items: [...state.items, newItem],
                    isOpen: true, // Optionally open drawer on add
                });
                return true;
            },
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id
                            ? { ...item, quantity: Math.max(1, quantity) } // Ensure qty is at least 1
                            : item
                    ),
                })),
            clearFavorites: () => set({ items: [] }),
            openFavorites: () => set({ isOpen: true }),
            closeFavorites: () => set({ isOpen: false }),
            toggleFavorites: () => set((state) => ({ isOpen: !state.isOpen })),
            isFavorite: (productId, sizeId) => {
                const state = get();
                return state.items.some(
                    (item) => item.productId === productId && item.sizeId === sizeId
                );
            },
        }),
        {
            name: 'favorites-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
