export interface ProductProps {
  id: string;
  image: string;
  description?: {
    "en-US": string;
  };
  key?: string;
  title: string;
  price: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
    type: string;
  };
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
