/**
 * Star Citizen Salvage Materials Reference
 * Complete list of in-game materials obtained from salvaging derelict ships
 * Based on UVerse Star Citizen Salvage Guide: https://uverse.space/salvage
 */

export const SALVAGE_MATERIALS = {
  raw: [
    "Recycled Material Composite",
    "Scrap",
    "Construction Material Pebbles",
    "Construction Material Rubble",
    "Construction Material Salvage",
    "Construction Pieces"
  ],
  refined: [
    "Construction Materials"
  ]
};

// Flatten all materials into a single array for easy access
export const ALL_MATERIALS = [
  ...SALVAGE_MATERIALS.raw,
  ...SALVAGE_MATERIALS.refined
];

// Material price tiers (approximate baseline prices in aUEC per unit for salvage)
// Based on UVerse current market rates
export const MATERIAL_BASE_PRICES = {
  // Raw salvage materials
  "Recycled Material Composite": 6952,
  "Scrap": 3493,
  "Construction Material Pebbles": 0,
  "Construction Material Rubble": 0,
  "Construction Material Salvage": 0,
  "Construction Pieces": 0,
  
  // Refined materials
  "Construction Materials": 11882
};

/**
 * Get material category
 * @param {string} material - Material name
 * @returns {string} - Category name or 'unknown'
 */
export function getMaterialCategory(material) {
  if (SALVAGE_MATERIALS.raw.includes(material)) return "raw";
  if (SALVAGE_MATERIALS.refined.includes(material)) return "refined";
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
