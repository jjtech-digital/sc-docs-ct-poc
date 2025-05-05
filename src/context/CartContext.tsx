"use client";

import { ProductProps } from "@/types/ProductProps";
import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "react-toastify";

type CartItem = ProductProps & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: ProductProps) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCart: () => Promise<CartItem[]>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const getCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-US",
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }
      
      const cartItems = await res.json();
      if (!cartItems) {
        return [];
      }
      
      if (cartItems?.products?.length >= 1) {
        setCart(cartItems.products);
      }
      
      return cartItems?.products || [];
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
      return [];
    }
  };

  const addToCart = async (product: ProductProps) => {
    try {
      const res = await fetch("/api/cart/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          variantId: 1,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add item to cart");
      }

      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prev, { ...product, quantity: 1 }];
      });
      
      toast("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const res = await fetch("/api/cart/remove-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItemId: id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove item from cart");
      }

      setCart((prev) => prev.filter((item) => item.id !== id));
      toast("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    }
  };

  const clearCart = async () => {
    try {
      const currentCart = await getCart();
      
      if (currentCart && currentCart.length > 0) {
        const removePromises = currentCart.map((item : ProductProps )=> 
          fetch("/api/cart/remove-item", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lineItemId: item.id,
            }),
          })
        );
        
        await Promise.all(removePromises);
      }
      
      setCart([]);
      toast("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
