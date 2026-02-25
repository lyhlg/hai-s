import { useState, useCallback } from "react";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

const CART_KEY = "hai-s-cart";

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const addItem = useCallback((menuItemId: string, name: string, price: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItemId);
      const next = existing
        ? prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { menuItemId, name, price, quantity: 1 }];
      saveCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    setItems((prev) => {
      const next = quantity <= 0
        ? prev.filter((i) => i.menuItemId !== menuItemId)
        : prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i));
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, addItem, updateQuantity, clearCart, totalAmount, totalCount };
}
