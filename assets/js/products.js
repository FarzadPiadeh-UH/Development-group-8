export const PRODUCTS = [
  {
    id: "p1",
    name: "Reusable Water Bottle",
    description: "A BPA-free bottle with a leak-proof cap. Great for commuting and gym use.",
    details: "750ml reusable bottle, dishwasher safe, comfortable carry loop.",
    price: 14.99,
    image: "assets/img/p1.jpg",
    alt: "Reusable water bottle"
  },
  {
    id: "p2",
    name: "Notebook (A5)",
    description: "Hardcover notebook with lined pages for study notes and daily planning.",
    details: "200 lined pages, durable cover, bookmark ribbon and elastic closure.",
    price: 8.50,
    image: "assets/img/p2.jpg",
    alt: "Hardcover notebook"
  },
  {
    id: "p3",
    name: "USB-C Cable",
    description: "Braided USB-C cable for charging and data transfer.",
    details: "2 metres, reinforced connectors, supports fast charging (device dependent).",
    price: 6.25,
    image: "assets/img/p3.jpg",
    alt: "USB-C cable"
  },
  {
    id: "p4",
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness for reading and focused work.",
    details: "3 brightness levels, adjustable angle, energy-efficient LED.",
    price: 22.00,
    image: "assets/img/p4.jpg",
    alt: "Desk lamp"
  },
  {
    id: "p5",
    name: "Wireless Mouse",
    description: "Comfort-grip wireless mouse with quiet clicks.",
    details: "2.4GHz wireless, adjustable DPI, ergonomic shape for long sessions.",
    price: 18.75,
    image: "assets/img/p5.jpg",
    alt: "Wireless mouse"
  },
  {
    id: "p6",
    name: "Backpack",
    description: "Lightweight daypack with a padded sleeve for laptops.",
    details: "Fits up to 15-inch laptops, water-resistant fabric, multiple compartments.",
    price: 34.95,
    image: "assets/img/p6.jpg",
    alt: "Backpack"
  },
  {
    id: "p7",
    name: "Travel Mug",
    description: "Insulated mug for hot and cold drinks, ideal for travel.",
    details: "Stainless steel, spill-resistant lid, keeps drinks warm longer.",
    price: 16.40,
    image: "assets/img/p7.jpg",
    alt: "Travel mug"
  },
  {
    id: "p8",
    name: "Headphones",
    description: "Over-ear headphones with cushioned pads for comfort.",
    details: "Foldable design, adjustable headband, wired connection for reliability.",
    price: 49.99,
    image: "assets/img/p8.jpg",
    alt: "Over-ear headphones"
  },
  {
    id: "p9",
    name: "Phone Stand",
    description: "Adjustable phone stand for desk and video calls.",
    details: "Angle adjustment, non-slip base, works with most phone sizes.",
    price: 9.90,
    image: "assets/img/p9.jpg",
    alt: "Phone stand"
  },
  {
    id: "p10",
    name: "Portable Charger",
    description: "10,000 mAh power bank for charging on the go.",
    details: "LED battery indicator, dual USB outputs, compact size.",
    price: 27.50,
    image: "assets/img/p10.jpg",
    alt: "Portable charger (power bank)"
  },
  {
    id: "p11",
    name: "Cable Organiser",
    description: "Keep cables tidy with a compact organiser set.",
    details: "Includes 10 clips, reusable straps, helps reduce desk clutter.",
    price: 7.20,
    image: "assets/img/p11.jpg",
    alt: "Cable organiser"
  },
  {
    id: "p12",
    name: "Mini Bluetooth Speaker",
    description: "Small speaker with clear sound for desks and small rooms.",
    details: "Bluetooth connectivity, USB charging, up to 6 hours playback (typical).",
    price: 19.30,
    image: "assets/img/p12.jpg",
    alt: "Bluetooth speaker"
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
