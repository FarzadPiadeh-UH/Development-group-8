function svgDataUri(title) {
  const safe = String(title).replace(/[<>&"]/g, "");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
    <rect width="100%" height="100%" fill="#efefef"/>
    <rect x="80" y="80" width="1040" height="540" rx="36" fill="#ffffff" stroke="#c9c9c9" stroke-width="6"/>
    <text x="600" y="360" font-family="Arial, sans-serif" font-size="54" text-anchor="middle" fill="#111111">
      ${safe}
    </text>
    <text x="600" y="430" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="#444444">
      Accessible Shop demo image
    </text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg.trim());
}

export const PRODUCTS = [
  { id: "p1",  name: "Reusable Water Bottle", description: "BPA-free bottle with leak-proof cap.", price: 14.99, image: svgDataUri("Reusable Water Bottle"), alt: "Reusable water bottle product image" },
  { id: "p2",  name: "Notebook (A5)",         description: "Hardcover, 200 pages, lined paper.",  price: 8.50,  image: svgDataUri("Notebook (A5)"), alt: "Notebook product image" },
  { id: "p3",  name: "USB-C Cable",           description: "Durable braided cable, 2 metres.",   price: 6.25,  image: svgDataUri("USB-C Cable"), alt: "USB-C cable product image" },
  { id: "p4",  name: "Desk Lamp",             description: "LED lamp with adjustable brightness.", price: 22.00, image: svgDataUri("Desk Lamp"), alt: "Desk lamp product image" },
  { id: "p5",  name: "Wireless Mouse",        description: "Comfort grip, silent clicks.",      price: 18.75, image: svgDataUri("Wireless Mouse"), alt: "Wireless mouse product image" },
  { id: "p6",  name: "Backpack",              description: "Lightweight daypack with laptop sleeve.", price: 34.95, image: svgDataUri("Backpack"), alt: "Backpack product image" },
  { id: "p7",  name: "Travel Mug",            description: "Insulated mug for hot and cold drinks.", price: 16.40, image: svgDataUri("Travel Mug"), alt: "Travel mug product image" },
  { id: "p8",  name: "Headphones",            description: "Over-ear headphones with cushioned pads.", price: 49.99, image: svgDataUri("Headphones"), alt: "Headphones product image" },
  { id: "p9",  name: "Phone Stand",           description: "Adjustable stand for desk use.",    price: 9.90, image: svgDataUri("Phone Stand"), alt: "Phone stand product image" },
  { id: "p10", name: "Portable Charger",      description: "10,000 mAh power bank.",            price: 27.50, image: svgDataUri("Portable Charger"), alt: "Portable charger product image" }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
