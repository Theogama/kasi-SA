import React, { createContext, useContext, useEffect, useState } from "react";
import { cartItemHasSize, cartLineKey, parsePriceLabel } from "@/lib/products";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  frontImage: string;
  backImage: string;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  updateItemSize: (productId: string, fromSize: string | undefined, toSize: string) => void;
  clearCart: () => void;
  replaceItems: (items: CartItem[]) => void;
  totalItems: number;
  totalPrice: number;
  allItemsHaveSize: boolean;
}

const CART_STORAGE_KEY = "kasi-cart-v2";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prevItems, { ...item, quantity }];
    });
  };

  const removeFromCart = (productId: string, size?: string) => {
    setItems((prevItems) =>
      prevItems.filter((i) => cartLineKey(i.id, i.size) !== cartLineKey(productId, size))
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((i) =>
        cartLineKey(i.id, i.size) === cartLineKey(productId, size)
          ? { ...i, quantity }
          : i
      )
    );
  };

  const updateItemSize = (productId: string, fromSize: string | undefined, toSize: string) => {
    const trimmed = toSize.trim();
    if (!trimmed) return;

    setItems((prevItems) => {
      const fromKey = cartLineKey(productId, fromSize);
      const toKey = cartLineKey(productId, trimmed);
      const source = prevItems.find((i) => cartLineKey(i.id, i.size) === fromKey);
      if (!source) return prevItems;

      if (fromKey === toKey) {
        return prevItems.map((i) =>
          cartLineKey(i.id, i.size) === fromKey ? { ...i, size: trimmed } : i
        );
      }

      const target = prevItems.find((i) => cartLineKey(i.id, i.size) === toKey);
      if (target) {
        return prevItems
          .map((i) =>
            cartLineKey(i.id, i.size) === toKey
              ? { ...i, quantity: i.quantity + source.quantity }
              : i
          )
          .filter((i) => cartLineKey(i.id, i.size) !== fromKey);
      }

      return prevItems.map((i) =>
        cartLineKey(i.id, i.size) === fromKey ? { ...i, size: trimmed } : i
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const replaceItems = (nextItems: CartItem[]) => {
    setItems(nextItems);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const price = parsePriceLabel(item.price);
    return sum + price * item.quantity;
  }, 0);

  const allItemsHaveSize = items.length > 0 && items.every((item) => cartItemHasSize(item.size));

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemSize,
    clearCart,
    replaceItems,
    totalItems,
    totalPrice,
    allItemsHaveSize,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
