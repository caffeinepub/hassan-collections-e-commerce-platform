import { create } from "zustand";
import { persist } from "zustand/middleware";
import { requestBackgroundSync } from "./pwa";

export interface CartItem {
  productId: string;
  name: string;
  pricePhpCents: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPricePhpCents: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId,
          );
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        });
        // Request background sync for cart updates
        requestBackgroundSync("sync-cart");
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
        requestBackgroundSync("sync-cart");
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
        requestBackgroundSync("sync-cart");
      },
      clearCart: () => {
        set({ items: [] });
        requestBackgroundSync("sync-cart");
      },
      getTotalPricePhpCents: () => {
        const items = get().items;
        return items.reduce(
          (total, item) => total + item.pricePhpCents * item.quantity,
          0,
        );
      },
    }),
    {
      name: "hassane-cart-storage",
    },
  ),
);
