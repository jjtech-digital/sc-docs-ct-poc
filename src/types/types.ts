export interface ProductProps {
  id: string;
  image: string;
  description?: {
    "en-US": string;
  };
  key?: string;
  title: string;
  price: Price;
  name: { "en-US": string };
  slug?: { "en-US": string };
  masterVariant?: {
    id: string;
    prices: {
      value: {
        centAmount: number;
        currencyCode: string;
      };
    }[];
    images?: {
      url: string;
    }[];
    attributes?: {
      name: string;
      value: {
        "en-US": string;
      };
    }[];
    availability?: {
      isOnStock: boolean;
    };
  };
}

export interface Price {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
  type: string;
}

export interface CartLineItemPrice {
  country?: string;
  id?: string;
  key?: string;
  discounted: {
    value: Price;
    discount: {
      id?: string;
      type?: string;
    };
  };
  value: Price;
}

export interface CartItem {
  id: string;
  image: string;
  name: {
    "en-US": string;
    "en-GB"?: string;
    "de-DE"?: string;
  };
  price: CartLineItemPrice;
  quantity: number;
  totalPrice: Price;
}


export type Cart = {
  anonymousId?: string;
  currency?: string;
  id?: string;
  lineItems?: CartItem[];
  totalPrice?: Price
}

export type CartContextType = {
  cart: Cart;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCart: () => Promise<Cart>;
  isLoading: boolean;
};

export type SignupInfo = { email: string; password: string; firstName: string; lastName: string };

export type LoginInfo = { email: string; password: string };