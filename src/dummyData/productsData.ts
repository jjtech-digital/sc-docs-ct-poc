export interface ProductProps {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  category?: string;
  brand?: string;
  rating?: number;
  inStock?: boolean;
  description?: string;
  pros?: string[];
}

export const products: ProductProps[] = [
  {
    id: 1,
    title: "AirFlow Knit Sneakers",
    price: 79.99,
    imageUrl: "https://picsum.photos/id/21/400/400",
    category: "Footwear",
    brand: "StrideFlex",
    rating: 4.3,
    inStock: true,
    description:
      "Lightweight, breathable sneakers designed for all-day comfort and everyday wear. Ideal for walking, running, or casual outings.",
    pros: [
      "Breathable mesh fabric",
      "Ergonomic cushioning",
      "Slip-resistant sole",
    ],
  },
  {
    id: 2,
    title: "Voyager Leather Backpack",
    price: 149.0,
    imageUrl: "https://picsum.photos/id/175/400/400",
    category: "Bags",
    brand: "UrbanNomad",
    rating: 4.7,
    inStock: true,
    description:
      "Premium leather backpack with a modern design, spacious compartments, and durable zippers for daily commuting or travel.",
    pros: [
      "100% genuine leather",
      "Laptop-friendly interior",
      "Water-resistant coating",
    ],
  },
  {
    id: 3,
    title: "Lunar Smartwatch Pro",
    price: 219.99,
    imageUrl: "https://picsum.photos/id/225/400/400",
    category: "Electronics",
    brand: "NovaTech",
    rating: 4.5,
    inStock: false,
    description:
      "Feature-rich smartwatch with fitness tracking, heart rate monitoring, and phone sync. Sleek design for all occasions.",
    pros: [
      "Multi-day battery life",
      "Built-in GPS & health tracking",
      "Waterproof up to 50m",
    ],
  },
  {
    id: 4,
    title: "Heritage Denim Jacket",
    price: 99.95,
    imageUrl: "https://picsum.photos/id/435/400/400",
    category: "Apparel",
    brand: "DenimWorks",
    rating: 4.2,
    inStock: true,
    description:
      "Classic denim jacket with a vintage wash. Durable stitching and a comfortable fit for all-season style.",
    pros: ["Timeless design", "Reinforced seams", "Machine washable"],
  },
  {
    id: 5,
    title: "Pulse Wireless Headphones",
    price: 189.5,
    imageUrl: "https://picsum.photos/id/403/400/400",
    category: "Audio",
    brand: "SoundSphere",
    rating: 4.6,
    inStock: false,
    description:
      "High-fidelity wireless headphones with noise cancellation and 40-hour battery life. Built for immersive listening.",
    pros: [
      "Active noise cancellation",
      "Crystal clear audio",
      "Long battery life",
    ],
  },
];
