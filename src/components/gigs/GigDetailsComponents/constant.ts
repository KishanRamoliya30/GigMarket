export const PRICE_RANGES = {
  "Under ₹500": { maxPrice: 500 },
  "₹500–₹1500": { minPrice: 500, maxPrice: 1500 },
  "₹1500 & Above": { minPrice: 1501 },
  custom: { minPrice: 0, maxPrice: 0 },
};

export const RATING_MAP = {
  "5⭐": 5,
  "4⭐ and above": 4,
  "3⭐ and above": 3,
  "2⭐ and above": 2,
};

export const sortOptions = [
  "Pricing: High to Low",
  "Pricing: Low to High",
  "Rating: High to Low",
  "Rating: Low to High",
  "Recently Added",
];
