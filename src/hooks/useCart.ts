'use client';

import { create } from 'zustand';

export interface CartItemType {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  grind: string;
}

interface CartStore {
  items: CartItemType[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItemType, 'id'>) => void;
  removeItem: (productId: string, grind: string) => void;
  updateQuantity: (productId: string, grind: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.grind === item.grind
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId && i.grind === item.grind
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
          isOpen: true,
        };
      }
      return {
        items: [...state.items, { ...item, id: crypto.randomUUID() }],
        isOpen: true,
      };
    }),

  removeItem: (productId, grind) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.grind === grind)
      ),
    })),

  updateQuantity: (productId, grind, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter(
              (i) => !(i.productId === productId && i.grind === grind)
            )
          : state.items.map((i) =>
              i.productId === productId && i.grind === grind
                ? { ...i, quantity }
                : i
            ),
    })),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
