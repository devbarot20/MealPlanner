// Inlined CommonJS version of the utility functions for testing purposes
const parseIngredient = (str) => {
  if (!str || typeof str !== 'string') {
    return { quantity: null, unit: '', name: '', isUnscaled: true };
  }
  const s = str.trim();

  const quantityRegex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)\s*(.*)$/;
  const match = s.match(quantityRegex);

  if (!match) {
    return {
      quantity: null,
      unit: '',
      name: s,
      isUnscaled: true
    };
  }

  const rawQty = match[1];
  const rest = match[3].trim();

  let quantity = 0;
  try {
    if (rawQty.includes(' ')) {
      const [whole, frac] = rawQty.split(/\s+/);
      const [num, den] = frac.split('/');
      quantity = parseInt(whole, 10) + (parseFloat(num) / parseFloat(den));
    } else if (rawQty.includes('/')) {
      const [num, den] = rawQty.split('/');
      quantity = parseFloat(num) / parseFloat(den);
    } else {
      quantity = parseFloat(rawQty);
    }
  } catch (err) {
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

  const words = rest.split(/\s+/);
  const firstWord = words[0].toLowerCase().replace(/[^a-z]/g, '');

  if (commonUnits.includes(firstWord)) {
    const unit = words[0];
    const name = words.slice(1).join(' ').trim();
    return { quantity, unit, name, isUnscaled: false };
  } else {
    return { quantity, unit: '', name: rest, isUnscaled: false };
  }
};

const normalizeUnit = (unit) => {
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

const singularize = (name) => {
  if (!name) return '';
  const n = name.trim().toLowerCase();
  
  if (n === 'cloves') return 'clove';
  if (n === 'leaves') return 'leaf';
  if (n === 'chives') return 'chives';

  if (n.endsWith('s') && !n.endsWith('ss')) {
    if (n.endsWith('oes')) return n.slice(0, -2);
    if (n.endsWith('es') && !n.endsWith('ves') && !n.endsWith('ches') && !n.endsWith('shes')) {
      return n.slice(0, -1);
    }
    if (n.endsWith('ches') || n.endsWith('shes')) return n.slice(0, -2);
    if (n.endsWith('ves')) return n.slice(0, -3) + 'f';
    return n.slice(0, -1);
  }
  return n;
};

const formatQuantity = (num) => {
  if (num === null || num === undefined) return '';
  if (num % 1 === 0) return num.toString();
  
  const rounded = Math.round(num * 100) / 100;
  
  if (Math.abs(rounded - 0.5) < 0.01) return '1/2';
  if (Math.abs(rounded - 0.25) < 0.01) return '1/4';
  if (Math.abs(rounded - 0.75) < 0.01) return '3/4';
  if (Math.abs(rounded - 0.33) < 0.02) return '1/3';
  if (Math.abs(rounded - 0.67) < 0.02) return '2/3';
  if (Math.abs(rounded - 0.125) < 0.01) return '1/8';
  if (Math.abs(rounded - 0.375) < 0.01) return '3/8';
  if (Math.abs(rounded - 0.625) < 0.01) return '5/8';
  if (Math.abs(rounded - 0.875) < 0.01) return '7/8';
  
  return rounded.toString();
};

const consolidateGroceryList = (ingredientsList) => {
  if (!Array.isArray(ingredientsList)) return [];
  
  const merged = {};
  const unscaledList = [];
  let unscaledIndex = 0;

  ingredientsList.forEach(ingStr => {
    if (!ingStr || typeof ingStr !== 'string') return;
    
    const parsed = parseIngredient(ingStr);
    
    if (parsed.isUnscaled) {
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
        name: parsed.name,
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

describe('Grocery List & Ingredient Parser Utilities', () => {
  
  describe('parseIngredient', () => {
    it('should parse integers correctly', () => {
      const result = parseIngredient('2 onions');
      expect(result).toEqual({
        quantity: 2,
        unit: '',
        name: 'onions',
        isUnscaled: false
      });
    });

    it('should parse decimals correctly', () => {
      const result = parseIngredient('1.5 cups flour');
      expect(result).toEqual({
        quantity: 1.5,
        unit: 'cups',
        name: 'flour',
        isUnscaled: false
      });
    });

    it('should parse fractions correctly', () => {
      const result = parseIngredient('1/2 tsp salt');
      expect(result).toEqual({
        quantity: 0.5,
        unit: 'tsp',
        name: 'salt',
        isUnscaled: false
      });
    });

    it('should parse mixed numbers correctly', () => {
      const result = parseIngredient('1 1/2 lbs beef');
      expect(result).toEqual({
        quantity: 1.5,
        unit: 'lbs',
        name: 'beef',
        isUnscaled: false
      });
    });

    // Fallback cases as explicitly requested
    it('should fall back to original string and tag as unscaled for unparseable strings', () => {
      const testCases = [
        'salt to taste',
        'a pinch of cumin',
        'onion, diced',
        'fresh cilantro'
      ];

      testCases.forEach(str => {
        const result = parseIngredient(str);
        expect(result).toEqual({
          quantity: null,
          unit: '',
          name: str,
          isUnscaled: true
        });
      });
    });
  });

  describe('normalizeUnit', () => {
    it('should normalize units to singular forms', () => {
      expect(normalizeUnit('cups')).toBe('cup');
      expect(normalizeUnit('teaspoons')).toBe('tsp');
      expect(normalizeUnit('tsps')).toBe('tsp');
      expect(normalizeUnit('tablespoons')).toBe('tbsp');
      expect(normalizeUnit('lbs')).toBe('lb');
      expect(normalizeUnit('cloves')).toBe('clove');
    });
  });

  describe('singularize', () => {
    it('should singularize plural words', () => {
      expect(singularize('onions')).toBe('onion');
      expect(singularize('tomatoes')).toBe('tomato');
      expect(singularize('potatoes')).toBe('potato');
      expect(singularize('carrots')).toBe('carrot');
      expect(singularize('cloves')).toBe('clove');
    });
  });

  describe('formatQuantity', () => {
    it('should format decimals to pretty fractions or strings', () => {
      expect(formatQuantity(2)).toBe('2');
      expect(formatQuantity(0.5)).toBe('1/2');
      expect(formatQuantity(0.25)).toBe('1/4');
      expect(formatQuantity(0.75)).toBe('3/4');
    });
  });

  describe('consolidateGroceryList', () => {
    it('should consolidate duplicate ingredients with matching units', () => {
      const list = [
        '2 onions',
        '1 onion',
        '1.5 cups flour',
        '0.5 cup flour'
      ];
      const consolidated = consolidateGroceryList(list);
      
      const onionEntry = consolidated.find(item => item.key.startsWith('onion|'));
      const flourEntry = consolidated.find(item => item.key.startsWith('flour|'));

      expect(onionEntry.quantity).toBe(3);
      expect(flourEntry.quantity).toBe(2);
    });

    it('should list duplicate ingredients with unit mismatches as separate entries', () => {
      const list = [
        '2 cups milk',
        '1 gallon milk'
      ];
      const consolidated = consolidateGroceryList(list);
      expect(consolidated.length).toBe(2);
      
      const cupsEntry = consolidated.find(item => item.unit === 'cup');
      const gallonEntry = consolidated.find(item => item.unit === 'gallon');
      
      expect(cupsEntry.quantity).toBe(2);
      expect(gallonEntry.quantity).toBe(1);
    });

    it('should list unparseable fallback ingredients individually and not merge them', () => {
      const list = [
        'salt to taste',
        'salt to taste',
        'a pinch of cumin',
        '2 onions'
      ];
      const consolidated = consolidateGroceryList(list);
      
      expect(consolidated.length).toBe(4);
      
      const unscaledItems = consolidated.filter(item => item.isUnscaled);
      expect(unscaledItems.length).toBe(3);
      
      const salts = unscaledItems.filter(item => item.name === 'salt to taste');
      expect(salts.length).toBe(2);
    });
  });
});
