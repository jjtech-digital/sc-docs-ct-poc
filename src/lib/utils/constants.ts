import { Cart } from "@/types/types";

export const CART_QUERY_KEY = 'cart';

export const emptyCart: Cart = {
  lineItems: [],
  totalPrice: {
    centAmount: 0,
    currencyCode: "",
    fractionDigits: 0,
    type: "",
  },
  currency: "",
  anonymousId: "",
  id: "",
};