function svgDataUri(title, subtitle) {
  const safeT = String(title).replace(/[<>&"]/g, "");
  const safeS = String(subtitle || "").replace(/[<>&"]/g, "");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
    <rect width="100%" height="100%" fill="#eeeeee"/>
    <rect x="70" y="70" width="1060" height="560" rx="36" fill="#ffffff" stroke="#c9c9c9" stroke-width="6"/>
    <text x="600" y="340" font-family="Arial, sans-serif" font-size="58" text-anchor="middle" fill="#111111">${safeT}</text>
    <text x="600" y="420" font-family="Arial, sans-serif" font-size="30" text-anchor="middle" fill="#3f3f3f">${safeS}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg.trim());
}

export const PRODUCTS = [
  {
    id: "p1",
    name: "Reusable Water Bottle",
    description: "A BPA-free bottle with a leak-proof cap. Great for commuting and gym use.",
    details: "750ml reusable bottle, dishwasher safe, comfortable carry loop.",
    price: 14.99,
    image: svgDataUri("Reusable Water Bottle", "750ml • BPA-free"),
    alt: "Reusable water bottle product image"
  },
  {
    id: "p2",
    name: "Notebook (A5)",
    description: "Hardcover notebook with lined pages for study notes and daily planning.",
    details: "200 lined pages, durable cover, bookmark ribbon and elastic closure.",
    price: 8.50,
    image: svgDataUri("Notebook (A5)", "200 pages • Lined"),
    alt: "Notebook product image"
  },
  {
    id: "p3",
    name: "USB-C Cable",
    description: "Braided USB-C cable for charging and data transfer.",
    details: "2 metres, reinforced connectors, supports fast charging (device dependent).",
    price: 6.25,
    image: svgDataUri("USB-C Cable", "2m • Braided"),
    alt: "USB-C cable product image"
  },
  {
    id: "p4",
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness for reading and focused work.",
    details: "3 brightness levels, adjustable angle, energy-efficient LED.",
    price: 22.00,
    image: svgDataUri("Desk Lamp", "LED • Adjustable"),
    alt: "Desk lamp product image"
  },
  {
    id: "p5",
    name: "Wireless Mouse",
    description: "Comfort-grip wireless mouse with quiet clicks.",
    details: "2.4GHz wireless, adjustable DPI, ergonomic shape for long sessions.",
    price: 18.75,
    image: svgDataUri("Wireless Mouse", "Quiet clicks • Ergonomic"),
    alt: "Wireless mouse product image"
  },
  {
    id: "p6",
    name: "Backpack",
    description: "Lightweight daypack with a padded sleeve for laptops.",
    details: "Fits up to 15-inch laptops, water-resistant fabric, multiple compartments.",
    price: 34.95,
    image: svgDataUri("Backpack", "Laptop sleeve • Daypack"),
    alt: "Backpack product image"
  },
  {
    id: "p7",
    name: "Travel Mug",
    description: "Insulated mug for hot and cold drinks, ideal for travel.",
    details: "Stainless steel, spill-resistant lid, keeps drinks warm longer.",
    price: 16.40,
    image: svgDataUri("Travel Mug", "Insulated • Spill-resistant"),
    alt: "Travel mug product image"
  },
  {
    id: "p8",
    name: "Headphones",
    description: "Over-ear headphones with cushioned pads for comfort.",
    details: "Foldable design, adjustable headband, wired connection for reliability.",
    price: 49.99,
    image: svgDataUri("Headphones", "Over-ear • Cushioned"),
    alt: "Headphones product image"
  },
  {
    id: "p9",
    name: "Phone Stand",
    description: "Adjustable phone stand for desk and video calls.",
    details: "Angle adjustment, non-slip base, works with most phone sizes.",
    price: 9.90,
    image: svgDataUri("Phone Stand", "Adjustable • Non-slip"),
    alt: "Phone stand product image"
  },
  {
    id: "p10",
    name: "Portable Charger",
    description: "10,000 mAh power bank for charging on the go.",
    details: "LED battery indicator, dual USB outputs, compact size.",
    price: 27.50,
    image: svgDataUri("Portable Charger", "10,000 mAh • Dual USB"),
    alt: "Portable charger product image"
  },
  {
    id: "p11",
    name: "Cable Organiser",
    description: "Keep cables tidy with a compact organiser set.",
    details: "Includes 10 clips, reusable straps, helps reduce desk clutter.",
    price: 7.20,
    image: svgDataUri("Cable Organiser", "Clips • Straps"),
    alt: "Cable organiser product image"
  },
  {
    id: "p12",
    name: "Mini Bluetooth Speaker",
    description: "Small speaker with clear sound for desks and small rooms.",
    details: "Bluetooth connectivity, USB charging, up to 6 hours playback (typical).",
    price: 19.30,
    image: svgDataUri("Bluetooth Speaker", "Mini • Clear sound"),
    alt: "Bluetooth speaker product image"
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
