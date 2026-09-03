export const DEFAULT_PRODUCT_CATEGORIES = [
  "Forklift Attachments",
  "Warehouse & Logistics",
  "Safety Equipment",
  "Hardware & Piping",
  "Lifting Equipment",
  "Safety & Chemical",
  "Cable & Hose Bridges",
  "Column & Crash Protection",
  "Construction Trolleys",
  "Conveyor",
  "Plastic Crates",
  "Floor Mats",
  "Formwork Systems",
  "Industrial Heating Jackets",
  "Lithium-Ion Safety",
  "Pallet Rack Protection",
  "Pallet Trucks & Stackers",
  "Safety & Storage Cabinets",
  "Waste Containers",
  "Workbenches",
  "Steel Fabrication"
];

declare global {
  // eslint-disable-next-line no-var
  var dynamicCategoriesStore: string[] | undefined;
}

if (!global.dynamicCategoriesStore) {
  global.dynamicCategoriesStore = [...DEFAULT_PRODUCT_CATEGORIES];
}

export const PRODUCT_CATEGORIES = global.dynamicCategoriesStore;

export function addCategoryInMemory(categoryName: string) {
  const trimmed = categoryName.trim();
  if (!trimmed) return;
  if (!global.dynamicCategoriesStore) {
    global.dynamicCategoriesStore = [...DEFAULT_PRODUCT_CATEGORIES];
  }
  if (!global.dynamicCategoriesStore.includes(trimmed)) {
    global.dynamicCategoriesStore.push(trimmed);
  }
}

export function removeCategoryFromMemory(categoryName: string) {
  const trimmed = categoryName.trim();
  if (!global.dynamicCategoriesStore) return;
  global.dynamicCategoriesStore = global.dynamicCategoriesStore.filter(
    (cat) => cat.toLowerCase() !== trimmed.toLowerCase()
  );
}
