import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string; // Unique ID: productId_sizeId
    productId: number;
    sizeId: number;
    sizeName: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    maxStock: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'id'>) => boolean;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (newItem) => {
                const state = get();
                const uniqueId = `${newItem.productId}_${newItem.sizeId}`;
                const existingItem = state.items.find((item) => item.id === uniqueId);

                if (existingItem) {
                    if (existingItem.quantity + newItem.quantity > existingItem.maxStock) {
                        return false;
                    }
                    set({
                        items: state.items.map((item) =>
                            item.id === uniqueId
                                ? {
                                    ...item,
                                    quantity: item.quantity + newItem.quantity,
                                }
                                : item
                        ),
                        isOpen: true,
                    });
                    return true;
                }

                set({
                    items: [
                        ...state.items,
                        { ...newItem, id: uniqueId },
                    ],
                    isOpen: true,
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
                            ? { ...item, quantity: Math.min(Math.max(1, quantity), item.maxStock) } // Ensure qty is at least 1 and not more than maxStock
                            : item
                    ),
                })),
            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        }),
        {
            name: 'cart-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
