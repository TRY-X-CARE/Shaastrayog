"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { featuredProducts } from "@/lib/data";
import { trackAddToCart } from "@/lib/facebook-pixel";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  discountPercentage: number;
  quantity: number;
  image: string;
  availableUnits: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: (options?: { showMessage?: boolean }) => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      } catch (e) {
        console.error("Error parsing cart from localStorage", e);
      }
    }
  }, []);

  const saveCart = (updatedItems: CartItem[]) => {
    setItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const addItem = (item: CartItem) => {
    const existingItem = items.find((i) => i.id === item.id);

    const product = featuredProducts.find((i) => i.id === item.id);

    if (!product || product.availableUnits === 0) {
      toast.error("Item is out of stock, coming soon");
      return;
    }

    if (existingItem) {
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      );
      saveCart(updatedItems);
    } else {
      saveCart([...items, item]);
    }

    // Track Add to Cart event for Facebook Pixel
    trackAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      discountPercentage: item.discountPercentage,
      quantity: item.quantity,
      image: item.image,
      category: product?.category,
    });

    toast.success(`${item.name} has been added to your cart.`);
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    saveCart(items.filter((item) => item.id !== id));
    if (item) toast.info(`${item.name} removed from cart.`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    saveCart(updatedItems);
    toast.success("Cart updated.");
  };

  const clearCart = ({ showMessage = true }: { showMessage?: boolean } = {}) => {
    saveCart([]);
    if (showMessage) toast.warning("Cart cleared.");
  };

  // 🧠 Use useMemo to ensure correct total values
  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          Math.floor(
            item.quantity * item.price * (1 - item.discountPercentage / 100)
          ),
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
