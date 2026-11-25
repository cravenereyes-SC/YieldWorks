/**
 * Star Citizen Salvage Materials Reference
 * Complete list of in-game materials obtained from salvaging derelict ships
 */

export const SALVAGE_MATERIALS = {
  metals: [
    "Aluminum",
    "Copper",
    "Gold",
    "Lead",
    "Platinum",
    "Silver",
    "Steel",
    "Stainless Steel",
    "Titanium",
    "Tungsten"
  ],
  alloys: [
    "Beryllium Copper",
    "Durasteel",
    "Hardened Steel",
    "Inconel",
    "Invar",
    "Monel",
    "Nichrome",
    "Stainless Steel Alloy"
  ],
  electronics: [
    "Aluminum PCB",
    "Copper Wire",
    "Gold Connectors",
    "Microchips",
    "Platinum Contacts",
    "Silicon",
    "Solder",
    "Tantalum Capacitors"
  ],
  composites: [
    "Carbon Fiber",
    "Ceramic Matrix",
    "Fiberglass",
    "Kevlar",
    "Polymers",
    "Silica Composite"
  ]
};

// Flatten all materials into a single array for easy access
export const ALL_MATERIALS = [
  ...SALVAGE_MATERIALS.metals,
  ...SALVAGE_MATERIALS.alloys,
  ...SALVAGE_MATERIALS.electronics,
  ...SALVAGE_MATERIALS.composites
];

// Material price tiers (approximate baseline prices in aUEC per unit for salvage)
export const MATERIAL_BASE_PRICES = {
  // Metals (common salvage)
  "Aluminum": 150,
  "Copper": 120,
  "Gold": 300,
  "Lead": 100,
  "Platinum": 400,
  "Silver": 200,
  "Steel": 80,
  "Stainless Steel": 110,
  "Titanium": 180,
  "Tungsten": 220,
  
  // Alloys (processed salvage)
  "Beryllium Copper": 250,
  "Durasteel": 320,
  "Hardened Steel": 140,
  "Inconel": 350,
  "Invar": 160,
  "Monel": 280,
  "Nichrome": 200,
  "Stainless Steel Alloy": 190,
  
  // Electronics (salvaged components)
  "Aluminum PCB": 180,
  "Copper Wire": 100,
  "Gold Connectors": 350,
  "Microchips": 500,
  "Platinum Contacts": 450,
  "Silicon": 120,
  "Solder": 90,
  "Tantalum Capacitors": 380,
  
  // Composites (specialized materials)
  "Carbon Fiber": 220,
  "Ceramic Matrix": 280,
  "Fiberglass": 130,
  "Kevlar": 310,
  "Polymers": 110,
  "Silica Composite": 150
};

/**
 * Get material category
 * @param {string} material - Material name
 * @returns {string} - Category name or 'unknown'
 */
export function getMaterialCategory(material) {
  if (SALVAGE_MATERIALS.metals.includes(material)) return "metals";
  if (SALVAGE_MATERIALS.alloys.includes(material)) return "alloys";
  if (SALVAGE_MATERIALS.electronics.includes(material)) return "electronics";
  if (SALVAGE_MATERIALS.composites.includes(material)) return "composites";
  return "unknown";
}

/**
 * Get base price for a material
 * @param {string} material - Material name
 * @returns {number} - Base price or 0 if unknown
 */
export function getBasePriceForMaterial(material) {
  return MATERIAL_BASE_PRICES[material] || 0;
}

/**
 * Check if a material exists in the list
 * @param {string} material - Material name
 * @returns {boolean} - True if material is valid
 */
export function isValidMaterial(material) {
  return ALL_MATERIALS.includes(material);
}
