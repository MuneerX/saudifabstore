export interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  specImage?: string;
  stock: number;
  isFeatured: boolean;
  rating: number;
  badge?: string;
}

export const INITIAL_PRODUCTS: ProductData[] = [
  {
    _id: "prod-1",
    name: "Forklift Single-Fork Hook",
    description: "Heavy duty single-fork lifting attachment hook for quick overhead load hoisting.",
    price: 450.00,
    category: "Forklift Attachments",
    brand: "Brooq Al Khalij",
    images: ["/images/home/services/forkliftrepair.jpeg"],
    stock: 25,
    isFeatured: true,
    rating: 4.9,
    badge: "BESTSELLER"
  },
  {
    _id: "prod-2",
    name: "Forklift Double-Fork Hook / Hoist",
    description: "Dual fork beam attachment with heavy swivel safety hook for balanced industrial lifting.",
    price: 850.00,
    category: "Forklift Attachments",
    brand: "Brooq Al Khalij",
    images: ["/images/home/services/forkliftrepair.jpeg"],
    stock: 18,
    isFeatured: true,
    rating: 4.8,
    badge: "POPULAR"
  },
  {
    _id: "prod-3",
    name: "Forklift Working Platform / Man Basket",
    description: "OSHA compliant safety platform man basket with non-slip mesh floor and harness anchor points.",
    price: 1200.00,
    category: "Forklift Attachments",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/safety_3.jpeg"],
    stock: 12,
    isFeatured: true,
    rating: 5.0,
    badge: "CERTIFIED"
  },
  {
    _id: "prod-4",
    name: "Forklift Jib Attachment / Crane Boom",
    description: "Telescopic boom jib crane attachment converting forklifts into mobile boom cranes.",
    price: 1450.00,
    category: "Forklift Attachments",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/lifting_3.jpeg"],
    stock: 10,
    isFeatured: true,
    rating: 4.9,
    badge: "LIMITED"
  },
  {
    _id: "prod-5",
    name: "Forklift Sleeve Extension (Pair)",
    description: "Heavy steel sleeve extensions for handling extra wide pallets and long industrial cargo.",
    price: 320.00,
    category: "Forklift Attachments",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/transport2.jpeg"],
    stock: 30,
    isFeatured: true,
    rating: 4.7,
    badge: "NEW"
  },
  {
    _id: "prod-6",
    name: "Heavy Duty Industrial Steel Pallet",
    description: "Fully welded heavy duty industrial steel pallet for high weight warehousing and export.",
    price: 280.00,
    category: "Warehouse & Logistics",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/container_3.jpeg"],
    stock: 50,
    isFeatured: true,
    rating: 4.9,
    badge: "BESTSELLER"
  },
  {
    _id: "prod-7",
    name: "High-Vis Yellow Safety Bollard Post",
    description: "High visibility yellow/black steel safety bollard post for perimeter and equipment protection.",
    price: 190.00,
    category: "Safety Equipment",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/safety_3.jpeg"],
    stock: 40,
    isFeatured: true,
    rating: 4.8,
    badge: "SAFETY GRADE"
  },
  {
    _id: "prod-8",
    name: "Self-Dumping Steel Skip Hopper",
    description: "Automatic self-dumping steel waste skip hopper for forklift material handling.",
    price: 980.00,
    category: "Warehouse & Logistics",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/workshop2.jpeg"],
    stock: 15,
    isFeatured: true,
    rating: 4.9,
    badge: "HEAVY DUTY"
  },
  {
    _id: "prod-9",
    name: "Heavy Steel Workshop Trolley",
    description: "Multi-tier steel workshop trolley with heavy duty lockable swivel casters.",
    price: 340.00,
    category: "Warehouse & Logistics",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/transport2.jpeg"],
    stock: 20,
    isFeatured: false,
    rating: 4.6,
    badge: "POPULAR"
  },
  {
    _id: "prod-10",
    name: "Crane Material Basket with Hook",
    description: "Certified steel material lifting basket with four-leg chain sling attachment points.",
    price: 1100.00,
    category: "Lifting Equipment",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/lifting_3.jpeg"],
    stock: 14,
    isFeatured: true,
    rating: 5.0,
    badge: "CERTIFIED"
  },
  {
    _id: "prod-11",
    name: "Emergency Safety Shower & Eyewash",
    description: "Combination eyewash and emergency shower station for chemical plant safety.",
    price: 650.00,
    category: "Safety Equipment",
    brand: "Brooq Al Khalij",
    images: ["/images/home/services/chemical.jpeg"],
    stock: 22,
    isFeatured: true,
    rating: 4.9,
    badge: "SAFETY GRADE"
  },
  {
    _id: "prod-12",
    name: "Heavy Rig Pipe Clamps Assembly",
    description: "Rig-grade heavy duty pipe clamp assembly for high pressure oil and gas piping.",
    price: 145.00,
    category: "Hardware & Piping",
    brand: "Brooq Al Khalij",
    images: ["/images/home/services/steel.jpeg"],
    stock: 60,
    isFeatured: false,
    rating: 4.7,
    badge: "IN STOCK"
  },
  {
    _id: "prod-13",
    name: "Anti-Slip GRP Stair Tread Nosing (750mm)",
    description: "Black/Yellow high traction GRP non-slip stair tread nosing for industrial steps.",
    price: 45.00,
    category: "Safety Equipment",
    brand: "Brooq Al Khalij",
    images: ["/images/home/category_grid/safety_3.jpeg"],
    stock: 100,
    isFeatured: false,
    rating: 4.8,
    badge: "BESTSELLER"
  },
  {
    _id: "prod-14",
    name: "Secondary Oil Spill Containment Pallet",
    description: "Secondary spill containment pallet with galvanized steel grating for liquid drums.",
    price: 580.00,
    category: "Safety & Chemical",
    brand: "Brooq Al Khalij",
    images: ["/images/home/services/chemical.jpeg"],
    stock: 18,
    isFeatured: true,
    rating: 4.9,
    badge: "ECO-SAFE"
  },
  {
    _id: "prod-15",
    name: "Counter Support Cantilever Brackets",
    description: "High strength welded counter support brackets for tile, marble, and heavy ducting.",
    price: 85.00,
    category: "Hardware & Piping",
    brand: "Brooq Al Khalij",
    images: ["/images/home/services/stone.jpeg"],
    stock: 80,
    isFeatured: false,
    rating: 4.7,
    badge: "PREMIUM"
  }
];
