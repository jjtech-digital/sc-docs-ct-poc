export type Address = {
  firstName?: string;
  lastName?: string;
  streetName?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export type LineItem = {
  name?: {
    en?: string;
  };
  quantity: number;
  price: {
    value: {
      centAmount: number;
    };
    discounted?: boolean;
  };
  variant: {
    images?: Array<{
      url: string;
    }>;
  };
};

export type ShippingInfo = {
  price?: {
    centAmount: number;
  };
  shippingMethodName?: string;
};

export type TotalPrice = {
  centAmount: number;
  currencyCode?: string;
};

export type TaxedPrice = {
  totalNet: {
    centAmount: number;
  };
};

export type Order = {
  shippingAddress?: Address;
  billingAddress?: Address;
  lineItems: LineItem[];
  customerEmail?: string;
  shippingInfo?: ShippingInfo;
  totalPrice?: TotalPrice;
  taxedPrice?: TaxedPrice;
  orderNumber?: string;
  id?: string;
  paymentState?: string;
};

export type OrderConfirmationProps = {
  order: Order;
};
