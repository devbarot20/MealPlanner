/**
 * Parses an ingredient string to extract its numeric quantity, unit, and name.
 * Handles fallback cases where numeric values cannot be confidently extracted.
 */
export const parseIngredient = (str) => {
  if (!str || typeof str !== 'string') {
    return { quantity: null, unit: '', name: '', isUnscaled: true };
  }
  const s = str.trim();

  // Match leading numeric pattern (integer, decimal, fraction, mixed number)
  // Types:
  // - "1 1/2" (mixed number)
  // - "1/2" (fraction)
  // - "1.5" (decimal)
  // - "2" (integer)
  const quantityRegex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)\s*(.*)$/;
  const match = s.match(quantityRegex);

  if (!match) {
    // FALLBACK CASE: Return original string unchanged, tagged as unscaled
    return {
      quantity: null,
      unit: '',
      name: s,
      isUnscaled: true
    };
  }

  const rawQty = match[1];
  const rest = match[3].trim();

  // Parse quantity string into decimal
  let quantity = 0;
  try {
    if (rawQty.includes(' ')) {
      // Mixed number, e.g., "1 1/2"
      const [whole, frac] = rawQty.split(/\s+/);
      const [num, den] = frac.split('/');
      quantity = parseInt(whole, 10) + (parseFloat(num) / parseFloat(den));
    } else if (rawQty.includes('/')) {
      // Fraction, e.g., "1/2"
      const [num, den] = rawQty.split('/');
      quantity = parseFloat(num) / parseFloat(den);
    } else {
      // Decimal or integer
      quantity = parseFloat(rawQty);
    }
  } catch (err) {
    // If parsing fails for any reason, fall back
    return {
      quantity: null,
      unit: '',
      name: s,
      isUnscaled: true
    };
  }

  if (isNaN(quantity)) {
    return {
      quantity: null,
      unit: '',
      name: s,
      isUnscaled: true
    };
  }

  // List of common cooking units
  const commonUnits = [
    'cup', 'cups',
    'tsp', 'teaspoon', 'teaspoons',
    'tbsp', 'tablespoon', 'tablespoons',
    'g', 'gram', 'grams',
    'kg', 'kilogram', 'kilograms',
    'ml', 'milliliter', 'milliliters',
    'l', 'liter', 'liters',
    'oz', 'ounce', 'ounces',
    'lb', 'lbs', 'pound', 'pounds',
    'clove', 'cloves',
    'can', 'cans',
    'slice', 'slices',
    'piece', 'pieces',
    'head', 'heads',
    'pinch', 'pinches',
    'sprig', 'sprigs',
    'bunch', 'bunches',
    'package', 'packages',
    'bag', 'bags',
    'container', 'containers',
    'canister', 'canisters',
    'bottle', 'bottles',
    'jar', 'jars',
    'gallon', 'gallons',
    'quart', 'quarts',
    'pint', 'pints',
    'dash', 'dashes'
  ];

  // Check if first word of rest is a unit
  const words = rest.split(/\s+/);
  const firstWord = words[0].toLowerCase().replace(/[^a-z]/g, '');

  if (commonUnits.includes(firstWord)) {
    const unit = words[0];
    const name = words.slice(1).join(' ').trim();
    return { quantity, unit, name, isUnscaled: false };
  } else {
    // No unit, first word is part of the name
    return { quantity, unit: '', name: rest, isUnscaled: false };
  }
};

/**
 * Normalizes a cooking unit to its singular form.
 */
export const normalizeUnit = (unit) => {
  if (!unit) return '';
  const u = unit.trim().toLowerCase();
  if (u === 'cups') return 'cup';
  if (u === 'teaspoons' || u === 'tsps') return 'tsp';
  if (u === 'teaspoon') return 'tsp';
  if (u === 'tablespoons' || u === 'tbsps') return 'tbsp';
  if (u === 'tablespoon') return 'tbsp';
  if (u === 'grams' || u === 'g') return 'g';
  if (u === 'gram') return 'g';
  if (u === 'kilograms' || u === 'kgs') return 'kg';
  if (u === 'kilogram') return 'kg';
  if (u === 'ounces' || u === 'ozs') return 'oz';
  if (u === 'ounce') return 'oz';
  if (u === 'pounds' || u === 'lbs') return 'lb';
  if (u === 'pound') return 'lb';
  if (u === 'cloves') return 'clove';
  if (u === 'cans') return 'can';
  if (u === 'slices') return 'slice';
  if (u === 'pieces') return 'piece';
  if (u === 'heads') return 'head';
  if (u === 'pinches') return 'pinch';
  if (u === 'sprigs') return 'sprig';
  if (u === 'bunches') return 'bunch';
  if (u === 'packages') return 'package';
  if (u === 'bags') return 'bag';
  if (u === 'containers') return 'container';
  if (u === 'canisters') return 'canister';
  if (u === 'bottles') return 'bottle';
  if (u === 'jars') return 'jar';
  if (u === 'gallons') return 'gallon';
  if (u === 'quarts') return 'quart';
  if (u === 'pints') return 'pint';
  if (u === 'dashes') return 'dash';
  return u;
};

/**
 * Singularizes common ingredient names to enable better merging.
 */
export const singularize = (name) => {
  if (!name) return '';
  const n = name.trim().toLowerCase();
  
  if (n === 'cloves') return 'clove';
  if (n === 'leaves') return 'leaf';
  if (n === 'chives') return 'chives';

  // Basic plural rules for cooking ingredients
  if (n.endsWith('s') && !n.endsWith('ss')) {
    if (n.endsWith('oes')) return n.slice(0, -2); // potatoes -> potato, tomatoes -> tomato
    if (n.endsWith('es') && !n.endsWith('ves') && !n.endsWith('ches') && !n.endsWith('shes')) {
      return n.slice(0, -1);
    }
    if (n.endsWith('ches') || n.endsWith('shes')) return n.slice(0, -2); // radishes -> radish, peaches -> peach
    if (n.endsWith('ves')) return n.slice(0, -3) + 'f'; // leaves -> leaf
    return n.slice(0, -1); // onions -> onion, carrots -> carrot
  }
  return n;
};

/**
 * Formats a decimal quantity back to a clean string representation (e.g. fraction or rounded decimal).
 */
export const formatQuantity = (num) => {
  if (num === null || num === undefined) return '';
  if (num % 1 === 0) return num.toString();
  
  const rounded = Math.round(num * 100) / 100;
  
  // Format common fractions
  if (Math.abs(rounded - 0.5) < 0.01) return '1/2';
  if (Math.abs(rounded - 0.25) < 0.01) return '1/4';
  if (Math.abs(rounded - 0.75) < 0.01) return '3/4';
  if (Math.abs(rounded - 0.33) < 0.02) return '1/3';
  if (Math.abs(rounded - 0.67) < 0.02) return '2/3';
  if (Math.abs(rounded - 0.125) < 0.01) return '1/8';
  if (Math.abs(rounded - 0.375) < 0.01) return '3/8';
  if (Math.abs(rounded - 0.625) < 0.01) return '5/8';
  if (Math.abs(rounded - 0.875) < 0.01) return '7/8';
  if (Math.abs(rounded - 0.2) < 0.01) return '1/5';
  
  return rounded.toString();
};

/**
 * Formats a consolidated ingredient object into a display string.
 */
export const formatConsolidatedItem = (item) => {
  if (item.isUnscaled) {
    return item.name;
  }
  
  if (item.quantity === null) {
    return item.name;
  }

  let displayUnit = item.unit;
  if (item.quantity > 1) {
    // Pluralize units for display
    if (displayUnit === 'cup') displayUnit = 'cups';
    else if (displayUnit === 'clove') displayUnit = 'cloves';
    else if (displayUnit === 'can') displayUnit = 'cans';
    else if (displayUnit === 'slice') displayUnit = 'slices';
    else if (displayUnit === 'piece') displayUnit = 'pieces';
    else if (displayUnit === 'head') displayUnit = 'heads';
    else if (displayUnit === 'pinch') displayUnit = 'pinches';
    else if (displayUnit === 'sprig') displayUnit = 'sprigs';
    else if (displayUnit === 'bunch') displayUnit = 'bunches';
    else if (displayUnit === 'package') displayUnit = 'packages';
    else if (displayUnit === 'bag') displayUnit = 'bags';
    else if (displayUnit === 'container') displayUnit = 'containers';
    else if (displayUnit === 'bottle') displayUnit = 'bottles';
    else if (displayUnit === 'jar') displayUnit = 'jars';
    else if (displayUnit === 'tsp') displayUnit = 'tsps';
    else if (displayUnit === 'tbsp') displayUnit = 'tbsps';
  }

  const displayQty = formatQuantity(item.quantity);
  
  let displayName = item.name;
  // Pluralize ingredient name if quantity > 1 and there is no unit
  if (!displayUnit && item.quantity > 1) {
    if (displayName.endsWith('o')) displayName += 'es';
    else if (!displayName.endsWith('s')) displayName += 's';
  }

  return `${displayQty} ${displayUnit ? displayUnit + ' ' : ''}${displayName}`;
};

/**
 * Aggregates and consolidates a flat list of ingredient strings into a merged list.
 * Unparseable ingredients are returned individually as-is (not merged).
 */
export const consolidateGroceryList = (ingredientsList) => {
  if (!Array.isArray(ingredientsList)) return [];
  
  const merged = {};
  const unscaledList = [];
  let unscaledIndex = 0;

  ingredientsList.forEach(ingStr => {
    if (!ingStr || typeof ingStr !== 'string') return;
    
    const parsed = parseIngredient(ingStr);
    
    if (parsed.isUnscaled) {
      // Put unscaled items in a separate list to list them individually
      unscaledList.push({
        name: parsed.name,
        unit: '',
        quantity: null,
        isUnscaled: true,
        key: `unscaled-${unscaledIndex++}`
      });
      return;
    }

    const normUnit = normalizeUnit(parsed.unit);
    const singName = singularize(parsed.name);
    const key = `${singName}|${normUnit}`;

    if (!merged[key]) {
      merged[key] = {
        name: parsed.name, // Keep the casing/name of the first occurrence
        unit: normUnit || parsed.unit,
        quantity: parsed.quantity,
        isUnscaled: false,
        key
      };
    } else {
      if (merged[key].quantity !== null && parsed.quantity !== null) {
        merged[key].quantity += parsed.quantity;
      }
    }
  });

  return [
    ...Object.values(merged),
    ...unscaledList
  ];
};
