export const PRICE_RANGES = {
  "Under ₹500": { maxPrice: 500 },
  "₹500–₹1500": { minPrice: 500, maxPrice: 1500 },
  "₹1500 & Above": { minPrice: 1501 },
  custom: { minPrice: 0, maxPrice: 0 },
};

export const RATING_MAP = {
  "⭐⭐⭐⭐⭐": 5,
  "⭐⭐⭐⭐ and above": 4,
  "⭐⭐⭐ and above": 3,
  "⭐⭐ and above": 2,
};

export const sortOptions = [
  "Pricing: High to Low",
  "Pricing: Low to High",
  "Rating: High to Low",
  "Rating: Low to High",
  "Recently Added",
];

export const bidColumns = [
  { id: 1, label: "Reqester", key: "createdBy", type: "user" },
  { id: 2, label: "Description", key: "description" },
  { id: 3, label: "Amount", key: "bidAmount", type: "amount" },
  { id: 4, label: "Date", key: "createdAt", type: "date" },
  { id: 5, label: "Status", key: "status", type: "bidStatus" },
];
