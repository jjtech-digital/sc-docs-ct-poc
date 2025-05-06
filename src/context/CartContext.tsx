"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CART_QUERY_KEY, emptyCart } from "@/lib/utils/constants";
import { CartContextType } from "@/types/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: cart = {...emptyCart}, isLoading, refetch } = useQuery({
    queryKey: [CART_QUERY_KEY],
    queryFn: async () => {
      try {
        const res = await fetch("/api/cart", {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "en-US",
          },
          cache: "no-store"
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch cart");
        }
        
        const cartData = await res.json();
        if (!cartData) {
          return emptyCart;
        }
        
        return cartData?.cart || emptyCart;
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart");
        return emptyCart;
      }
    },
  });

  const getCart = useCallback(async () => {
    await refetch();
    return cart;
  }, [refetch, cart]);

  const addToCartMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/cart/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          variantId: 1,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add item to cart");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.cart) {
        queryClient.setQueryData([CART_QUERY_KEY], data.cart);
      }
      toast("Added to cart");
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
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
      
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.cart) {
        queryClient.setQueryData([CART_QUERY_KEY], data.cart);
      }
      toast("Removed from cart");
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    }
  });

  const updateCartQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (quantity < 1) {
        return removeFromCartMutation.mutateAsync(id);
      }
      
      const res = await fetch("/api/cart/update-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItemId: id,
          quantity,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update item quantity");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.cart) {
        queryClient.setQueryData([CART_QUERY_KEY], data.cart);
      }
      toast("Quantity updated");
    },
    onError: (error) => {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/cart/clear-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to clear cart");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      if (data?.cart) {
        queryClient.setQueryData([CART_QUERY_KEY], data.cart);
      } else {
        queryClient.setQueryData([CART_QUERY_KEY], emptyCart);
      }
      toast("Cart cleared");
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  });

  const addToCart = (id: string) => addToCartMutation.mutate(id);
  const removeFromCart = (id: string) => removeFromCartMutation.mutate(id);
  const updateCartQuantity = (id: string, quantity: number) => 
    updateCartQuantityMutation.mutate({ id, quantity });
  const clearCart = () => clearCartMutation.mutate();

  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCart,
    isLoading
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
