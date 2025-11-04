// Category mapping and rules for transaction categorization

export const categoryKeywords = {
  "Food & Dining": {
    keywords: [
      "swiggy",
      "zomato",
      "uber eats",
      "restaurant",
      "cafe",
      "coffee",
      "pizza",
      "burger",
      "mcdonald",
      "kfc",
      "dominos",
      "subway",
      "starbucks",
      "food",
      "dining",
      "lunch",
      "dinner",
      "breakfast",
    ],
    subcategories: ["Dining Out", "Food Delivery", "Fast Food", "Groceries"],
  },

  Transportation: {
    keywords: [
      "uber",
      "ola",
      "rapido",
      "fuel",
      "petrol",
      "diesel",
      "metro",
      "taxi",
      "cab",
      "transport",
      "parking",
      "toll",
      "vehicle",
      "car",
      "bike",
    ],
    subcategories: [
      "Ride Share",
      "Public Transport",
      "Fuel",
      "Vehicle Maintenance",
      "Parking",
    ],
  },

  Shopping: {
    keywords: [
      "amazon",
      "flipkart",
      "myntra",
      "ajio",
      "clothing",
      "electronics",
      "shopping",
      "mall",
      "store",
      "retail",
      "purchase",
    ],
    subcategories: [
      "Online Shopping",
      "Clothing",
      "Electronics",
      "Home & Garden",
      "Personal Items",
    ],
  },

  Entertainment: {
    keywords: [
      "netflix",
      "prime",
      "hotstar",
      "spotify",
      "movie",
      "cinema",
      "pvr",
      "inox",
      "gaming",
      "entertainment",
      "subscription",
      "music",
    ],
    subcategories: [
      "Streaming Services",
      "Movies",
      "Music",
      "Gaming",
      "Events",
    ],
  },

  "Bills & Utilities": {
    keywords: [
      "electricity",
      "water",
      "gas",
      "internet",
      "broadband",
      "mobile",
      "phone",
      "utility",
      "bill",
      "rent",
      "emi",
      "loan",
      "insurance",
    ],
    subcategories: [
      "Electricity",
      "Water",
      "Internet",
      "Phone",
      "Rent",
      "Insurance",
      "EMI",
    ],
  },

  Healthcare: {
    keywords: [
      "hospital",
      "doctor",
      "pharmacy",
      "medicine",
      "medical",
      "health",
      "clinic",
      "dental",
      "lab",
      "diagnostics",
      "apollo",
      "medplus",
    ],
    subcategories: [
      "Doctor Visits",
      "Pharmacy",
      "Hospital",
      "Dental",
      "Lab Tests",
    ],
  },

  Education: {
    keywords: [
      "school",
      "college",
      "university",
      "course",
      "tuition",
      "education",
      "learning",
      "udemy",
      "coursera",
      "books",
      "stationery",
    ],
    subcategories: [
      "Tuition",
      "Books & Supplies",
      "Online Courses",
      "School Fees",
    ],
  },

  Travel: {
    keywords: [
      "hotel",
      "flight",
      "train",
      "bus",
      "travel",
      "booking",
      "makemytrip",
      "goibibo",
      "irctc",
      "vacation",
      "trip",
    ],
    subcategories: [
      "Accommodation",
      "Flights",
      "Trains",
      "Vacation",
      "Business Travel",
    ],
  },

  Groceries: {
    keywords: [
      "grocery",
      "supermarket",
      "bigbasket",
      "grofers",
      "blinkit",
      "zepto",
      "instamart",
      "dmart",
      "reliance fresh",
      "vegetables",
      "fruits",
    ],
    subcategories: ["Supermarket", "Online Grocery", "Fresh Produce"],
  },

  "Personal Care": {
    keywords: [
      "salon",
      "spa",
      "gym",
      "fitness",
      "cosmetics",
      "grooming",
      "haircut",
      "beauty",
      "wellness",
    ],
    subcategories: ["Salon", "Gym", "Spa", "Cosmetics", "Grooming"],
  },

  Investments: {
    keywords: [
      "investment",
      "mutual fund",
      "stocks",
      "equity",
      "sip",
      "zerodha",
      "groww",
      "upstox",
      "trading",
      "deposit",
      "fd",
      "rd",
    ],
    subcategories: [
      "Mutual Funds",
      "Stocks",
      "Fixed Deposits",
      "Crypto",
      "Real Estate",
    ],
  },

  Income: {
    keywords: [
      "salary",
      "income",
      "payment received",
      "refund",
      "cashback",
      "interest",
      "dividend",
      "bonus",
      "freelance",
    ],
    subcategories: [
      "Salary",
      "Freelance",
      "Interest",
      "Dividend",
      "Bonus",
      "Refund",
    ],
  },

  Transfers: {
    keywords: [
      "transfer",
      "upi",
      "neft",
      "rtgs",
      "imps",
      "paytm",
      "phonepe",
      "gpay",
      "google pay",
      "sent to",
      "received from",
    ],
    subcategories: ["UPI", "Bank Transfer", "P2P", "Wallet"],
  },
};

export const detectCategory = (description, amount, type) => {
  if (!description) return "Other";

  const lowerDesc = description.toLowerCase();

  // Check each category
  for (const [category, data] of Object.entries(categoryKeywords)) {
    for (const keyword of data.keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  // Special rules based on amount and type
  if (type === "credit" && amount > 10000) {
    return "Income";
  }

  if (lowerDesc.includes("transfer") || lowerDesc.includes("upi")) {
    return "Transfers";
  }

  return "Other";
};

export const detectSubcategory = (category, description) => {
  if (!categoryKeywords[category]) return null;

  const lowerDesc = description.toLowerCase();
  const subcategories = categoryKeywords[category].subcategories;

  // Simple subcategory detection (can be enhanced with ML)
  if (category === "Food & Dining") {
    if (
      lowerDesc.includes("swiggy") ||
      lowerDesc.includes("zomato") ||
      lowerDesc.includes("uber eats")
    ) {
      return "Food Delivery";
    }
    if (
      lowerDesc.includes("mcdonald") ||
      lowerDesc.includes("kfc") ||
      lowerDesc.includes("dominos")
    ) {
      return "Fast Food";
    }
    return "Dining Out";
  }

  return subcategories ? subcategories[0] : null;
};

export const extractMerchant = (description) => {
  if (!description) return null;

  // Remove common prefixes
  let cleaned = description
    .replace(/^(payment to|paid to|transfer to|upi-)/i, "")
    .trim();

  // Extract merchant name (before @ or first special char)
  const match = cleaned.match(/^([a-zA-Z0-9\s]+)[@-]/);
  if (match) {
    return match[1].trim();
  }

  // Return first meaningful part
  const words = cleaned.split(/\s+/);
  return words.slice(0, 3).join(" ");
};

export const detectRecurring = (
  description,
  amount,
  historicalTransactions
) => {
  // Check if similar transactions exist in history
  const similar = historicalTransactions.filter(
    (t) =>
      Math.abs(t.amount - amount) < 10 && // Similar amount (within 10 units)
      t.description &&
      description &&
      similarStrings(t.description, description)
  );

  return similar.length >= 2; // Found at least 2 similar transactions
};

export const suggestTags = (category, description, amount, type) => {
  const tags = [];

  // Category-based tags
  if (category === "Bills & Utilities") {
    tags.push("essential");
  }

  // Amount-based tags
  if (amount > 5000) {
    tags.push("large-expense");
  }

  // Type-based tags
  if (type === "credit") {
    tags.push("income");
  }

  // Description-based tags
  const lowerDesc = description?.toLowerCase() || "";

  if (lowerDesc.includes("subscription") || lowerDesc.includes("monthly")) {
    tags.push("recurring", "subscription");
  }

  if (lowerDesc.includes("business") || lowerDesc.includes("work")) {
    tags.push("business");
  }

  if (lowerDesc.includes("tax")) {
    tags.push("tax-deductible");
  }

  if (lowerDesc.includes("shared") || lowerDesc.includes("split")) {
    tags.push("shared-expense");
  }

  // Essential vs Discretionary
  const essentialCategories = [
    "Bills & Utilities",
    "Healthcare",
    "Groceries",
    "Transportation",
  ];
  if (essentialCategories.includes(category)) {
    tags.push("essential");
  } else {
    tags.push("discretionary");
  }

  return [...new Set(tags)]; // Remove duplicates
};

// Helper function to compare string similarity
const similarStrings = (str1, str2) => {
  if (!str1 || !str2) return false;

  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Simple similarity check - can be enhanced with Levenshtein distance
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size > 0.5; // 50% similarity
};

export default {
  categoryKeywords,
  detectCategory,
  detectSubcategory,
  extractMerchant,
  detectRecurring,
  suggestTags,
};
