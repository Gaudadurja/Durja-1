// ====================================
// LUXE STORE — Product Catalog Data
// ====================================

const PRODUCTS = [
  // ── Electronics ──
  {
    id: 1,
    name: "AuraSound Pro Wireless Headphones",
    category: "Electronics",
    price: 249.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    rating: 4.8,
    reviews: 2341,
    badge: "hot",
    description: "Immerse yourself in studio-quality sound with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions. Features spatial audio and seamless multi-device connectivity.",
    specs: { Brand: "AuraSound", Battery: "40 Hours", Driver: "50mm", Connectivity: "BT 5.3" },
    stock: 24,
    colors: ["Midnight Black", "Pearl White", "Navy Blue"]
  },
  {
    id: 2,
    name: "NovaTech 4K Ultra Smart Watch",
    category: "Electronics",
    price: 399.99,
    originalPrice: 499.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    rating: 4.6,
    reviews: 1856,
    badge: "sale",
    description: "The ultimate companion for your active lifestyle. Featuring a stunning 4K AMOLED display, advanced health monitoring, GPS tracking, and 7-day battery life in a titanium case.",
    specs: { Display: "4K AMOLED", Battery: "7 Days", Material: "Titanium", Water: "10 ATM" },
    stock: 15,
    colors: ["Silver", "Space Gray", "Rose Gold"]
  },
  {
    id: 3,
    name: "LumiPad Pro 14\" Tablet",
    category: "Electronics",
    price: 899.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    rating: 4.9,
    reviews: 967,
    badge: "new",
    description: "Unleash your creativity with a 14-inch Liquid Retina XDR display, M3 chip performance, and all-day battery. Perfect for artists, designers, and professionals on the go.",
    specs: { Display: "14\" XDR", Chip: "M3 Pro", Storage: "512GB", RAM: "16GB" },
    stock: 8,
    colors: ["Space Black", "Silver"]
  },
  {
    id: 4,
    name: "ZenBuds Ultra Earbuds",
    category: "Electronics",
    price: 179.99,
    originalPrice: 229.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80",
    rating: 4.5,
    reviews: 3124,
    badge: "sale",
    description: "Crystal-clear audio with adaptive ANC, transparency mode, and personalized spatial audio. IPX5 water-resistant with 30-hour total battery life including the wireless charging case.",
    specs: { ANC: "Adaptive", Battery: "30h Total", IP: "IPX5", Driver: "11mm" },
    stock: 42,
    colors: ["Onyx", "Ivory", "Sage Green"]
  },

  // ── Fashion ──
  {
    id: 5,
    name: "Luxe Cashmere Blend Overcoat",
    category: "Fashion",
    price: 325.00,
    originalPrice: 450.00,
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&q=80",
    rating: 4.7,
    reviews: 412,
    badge: "sale",
    description: "Handcrafted from premium Italian cashmere blend fabric. Features a tailored silhouette, notch lapels, and satin-lined interior. The epitome of modern luxury outerwear.",
    specs: { Material: "Cashmere Blend", Fit: "Tailored", Lining: "Satin", Origin: "Italy" },
    stock: 6,
    colors: ["Charcoal", "Camel", "Black"]
  },
  {
    id: 6,
    name: "Heritage Leather Crossbody Bag",
    category: "Fashion",
    price: 189.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    rating: 4.8,
    reviews: 728,
    badge: "new",
    description: "Crafted from full-grain vegetable-tanned leather that develops a beautiful patina over time. Features adjustable strap, multiple compartments, and brass hardware.",
    specs: { Material: "Full-Grain Leather", Strap: "Adjustable", Hardware: "Brass", Size: "28cm" },
    stock: 19,
    colors: ["Cognac", "Black", "Burgundy"]
  },
  {
    id: 7,
    name: "Artisan Gradient Silk Scarf",
    category: "Fashion",
    price: 95.00,
    originalPrice: 130.00,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    rating: 4.4,
    reviews: 256,
    badge: null,
    description: "Hand-dyed pure mulberry silk with a mesmerizing gradient effect. Lightweight and versatile — wear as a neck scarf, headband, or bag accessory.",
    specs: { Material: "100% Silk", Size: "90×90cm", Care: "Dry Clean", Weight: "Light" },
    stock: 33,
    colors: ["Sunset Ombré", "Ocean Blue", "Rose"]
  },
  {
    id: 8,
    name: "Urban Flex Runner Sneakers",
    category: "Fashion",
    price: 159.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    rating: 4.6,
    reviews: 1893,
    badge: "hot",
    description: "Engineered for all-day comfort with responsive CloudFoam midsole, breathable knit upper, and slip-resistant outsole. Where street style meets performance.",
    specs: { Sole: "CloudFoam", Upper: "Knit Mesh", Weight: "280g", Closure: "Lace-Up" },
    stock: 56,
    colors: ["Triple White", "Core Black", "Crimson Red"]
  },

  // ── Home & Living ──
  {
    id: 9,
    name: "Serenity Aromatherapy Diffuser",
    category: "Home & Living",
    price: 79.99,
    originalPrice: 109.99,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&q=80",
    rating: 4.7,
    reviews: 1456,
    badge: "sale",
    description: "Transform your space with this elegant ceramic ultrasonic diffuser. Features 7 LED mood lights, whisper-quiet operation, auto shut-off, and 12-hour run time.",
    specs: { Type: "Ultrasonic", Tank: "500ml", Timer: "12 Hours", Lights: "7 Colors" },
    stock: 28,
    colors: ["White Marble", "Matte Black", "Wood Grain"]
  },
  {
    id: 10,
    name: "Artisan Pour-Over Coffee Set",
    category: "Home & Living",
    price: 124.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    rating: 4.9,
    reviews: 834,
    badge: "new",
    description: "Elevate your morning ritual with this handcrafted borosilicate glass carafe, stainless steel filter, and walnut wood collar. Makes 4 cups of perfectly extracted coffee.",
    specs: { Material: "Borosilicate Glass", Capacity: "600ml", Filter: "Stainless Steel", Cups: "4 Cups" },
    stock: 12,
    colors: ["Clear/Walnut", "Smoke/Black"]
  },
  {
    id: 11,
    name: "Nordic Minimalist Desk Lamp",
    category: "Home & Living",
    price: 149.99,
    originalPrice: 189.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&q=80",
    rating: 4.5,
    reviews: 567,
    badge: null,
    description: "Scandinavian-inspired design with adjustable arm and head. Features touch-sensitive dimming, warm-to-cool color temperature control, and wireless charging base.",
    specs: { Light: "LED 12W", Temp: "2700K-6500K", Charge: "Qi Wireless", Material: "Aluminum" },
    stock: 20,
    colors: ["Matte White", "Brushed Gold", "Graphite"]
  },
  {
    id: 12,
    name: "Zen Garden Indoor Planter Set",
    category: "Home & Living",
    price: 64.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    rating: 4.3,
    reviews: 389,
    badge: null,
    description: "A curated set of three geometric concrete planters with bamboo trays. Each features a drainage hole and comes with a packet of premium succulent soil mix.",
    specs: { Count: "3 Pieces", Material: "Concrete", Tray: "Bamboo", Drainage: "Yes" },
    stock: 45,
    colors: ["Natural Gray", "Terracotta"]
  },

  // ── Accessories ──
  {
    id: 13,
    name: "Voyager Titanium Travel Bottle",
    category: "Accessories",
    price: 49.99,
    originalPrice: 69.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    rating: 4.8,
    reviews: 2876,
    badge: "hot",
    description: "Double-walled vacuum insulated titanium bottle keeps drinks cold 24h or hot 12h. Features leak-proof lid, one-hand operation, and eco-friendly design. 750ml capacity.",
    specs: { Material: "Titanium", Capacity: "750ml", Cold: "24 Hours", Hot: "12 Hours" },
    stock: 67,
    colors: ["Arctic Silver", "Midnight", "Forest Green"]
  },
  {
    id: 14,
    name: "Chrono Classic Automatic Watch",
    category: "Accessories",
    price: 595.00,
    originalPrice: 750.00,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
    rating: 4.9,
    reviews: 412,
    badge: "sale",
    description: "Swiss automatic movement with 42-hour power reserve. Sapphire crystal glass, exhibition case back, and genuine Italian leather strap. Water resistant to 100m.",
    specs: { Movement: "Automatic", Crystal: "Sapphire", Reserve: "42h", Water: "100m" },
    stock: 4,
    colors: ["Brown/Gold", "Black/Silver", "Navy/Rose Gold"]
  },
  {
    id: 15,
    name: "AeroTech Carbon Fiber Sunglasses",
    category: "Accessories",
    price: 219.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    rating: 4.6,
    reviews: 743,
    badge: "new",
    description: "Ultra-lightweight carbon fiber frames with polarized CR-39 lenses offering 100% UV400 protection. Anti-scratch and hydrophobic coating. Comes with hard case.",
    specs: { Frame: "Carbon Fiber", Lens: "Polarized CR-39", UV: "UV400", Weight: "22g" },
    stock: 31,
    colors: ["Matte Black", "Tortoise", "Gunmetal"]
  },
  {
    id: 16,
    name: "Terra Leather Minimalist Wallet",
    category: "Accessories",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    rating: 4.7,
    reviews: 1654,
    badge: null,
    description: "Slim-profile bifold wallet handmade from full-grain Pueblo leather. Features RFID blocking, 6 card slots, 2 bill compartments, and a hidden coin pocket.",
    specs: { Material: "Pueblo Leather", RFID: "Blocking", Cards: "6 Slots", Size: "11×8.5cm" },
    stock: 38,
    colors: ["Cognac", "Black", "Navy"]
  }
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS };
}
