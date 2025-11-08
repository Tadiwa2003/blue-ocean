import { highlightProducts } from '../data/products.js';

// Product-specific color and size variants
const productVariants = {
  // Totes
  'structured-panel-tote': {
    colors: ['Navy Blue', 'Cream', 'Sage Green', 'Terracotta', 'Charcoal'],
    sizes: ['Mini', 'Standard', 'Large', 'Extra Large'],
  },
  'ed-cherry-tote': {
    colors: ['Cherry Red', 'Navy', 'Black', 'Cream'],
    sizes: ['Standard', 'Large'],
  },
  'baindaishu-8518-tote': {
    colors: ['Navy', 'Cream', 'Sage Green', 'Charcoal'],
    sizes: ['Standard', 'Large', 'Tall'],
  },
  'scarf-handle-tote-6-22': {
    colors: ['Navy', 'Cream', 'Terracotta', 'Sage Green'],
    sizes: ['Standard', 'Large'],
  },
  'lk-l270-tote': {
    colors: ['Black', 'Navy', 'Cream', 'Charcoal'],
    sizes: ['Standard', 'Large'],
  },
  // Handbags
  'mini-satchel-6494-2': {
    colors: ['Black', 'Cognac', 'Blush Pink', 'Olive', 'Burgundy'],
    sizes: ['Mini', 'Standard'],
  },
  'animal-print-shoulder-bag': {
    colors: ['Zebra Print', 'Leopard Print', 'Houndstooth', 'Black'],
    sizes: ['Standard', 'Large'],
  },
  // Backpacks
  'backpack-8b057': {
    colors: ['Black', 'Navy', 'Forest Green', 'Slate Gray', 'Camel'],
    sizes: ['Standard', 'Large', 'XL'],
  },
  // Slides & Sandals
  'lucky-girl-w219013': {
    colors: ['Black', 'White', 'Tan', 'Navy', 'Coral'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  'lucky-girl-w219010': {
    colors: ['Black', 'White', 'Tan', 'Navy'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  'ha930m-platform-slide': {
    colors: ['Black', 'Cognac', 'Monochrome', 'Navy'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  'ha898m-floral-slide': {
    colors: ['Floral Print', 'Navy', 'Cream', 'Sage'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  'lucky-girl-w215111': {
    colors: ['Black', 'White', 'Tan', 'Navy', 'Coral'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  'ha918m-cross-strap-slide': {
    colors: ['Black', 'Navy', 'Tan', 'Cognac'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  'ha916m-cork-thong': {
    colors: ['Natural Cork', 'Black', 'Navy', 'Tan'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  'ha907m-classic-slide': {
    colors: ['Black', 'Navy', 'Cognac', 'White'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  'ha922m-embellished-clog': {
    colors: ['Black Velvet', 'Navy Velvet', 'Burgundy', 'Charcoal'],
    sizes: ['37', '38', '39', '40', '41', '42'],
  },
  // Nike & Jordan
  'nike-air-max-270': {
    colors: ['Black/White', 'Red/Black', 'Blue/White', 'Gray/Orange', 'Green/Yellow'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
  },
  'jordan-retro-1-high': {
    colors: ['Black/Red', 'Black/White', 'Blue/White', 'Gray/Orange'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
  },
  'nike-dunk-low': {
    colors: ['Black/White', 'Navy/White', 'Red/Black', 'Gray/Orange'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
  },
  'jordan-retro-4': {
    colors: ['Black/Cement', 'White/Fire Red', 'Military Blue', 'Bred'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
  },
  'nike-blazer-mid': {
    colors: ['Black/White', 'Navy/White', 'White/Gum', 'Vintage'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
  },
  // Clothing
  'coastal-linen-shirt': {
    colors: ['Navy', 'White', 'Sage', 'Terracotta', 'Charcoal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  'resort-maxi-dress': {
    colors: ['Tropical Print', 'Navy', 'White', 'Sage'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  'ocean-breeze-hoodie': {
    colors: ['Navy', 'Charcoal', 'Sage', 'White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  'summer-shorts-collection': {
    colors: ['Navy', 'White', 'Sage', 'Terracotta'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  'beachside-kimono': {
    colors: ['Ocean Blue', 'Sage Green', 'Coral', 'Navy'],
    sizes: ['One Size', 'Plus Size'],
  },
  'coastal-denim-jacket': {
    colors: ['Classic Blue', 'Black', 'Light Wash', 'Distressed'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  // Beauty Spa Services
  'oceanstone-glow-facial': {
    colors: ['Standard', 'Deluxe', 'Premium'],
    sizes: ['60 min', '90 min', '120 min'],
  },
  'coastal-aromatherapy-massage': {
    colors: ['Standard', 'Deluxe', 'Premium'],
    sizes: ['60 min', '90 min', '120 min'],
  },
  'sea-salt-body-scrub': {
    colors: ['Standard', 'Deluxe'],
    sizes: ['45 min', '60 min', '90 min'],
  },
  'marine-collagen-treatment': {
    colors: ['Standard', 'Premium', 'Signature'],
    sizes: ['75 min', '90 min', '120 min'],
  },
  'tidal-stone-therapy': {
    colors: ['Standard', 'Deluxe'],
    sizes: ['80 min', '90 min', '120 min'],
  },
  'reef-safe-manicure': {
    colors: ['Standard', 'Deluxe', 'Premium'],
    sizes: ['45 min', '60 min'],
  },
  'seaweed-wrap-ritual': {
    colors: ['Standard', 'Deluxe', 'Premium'],
    sizes: ['90 min', '120 min'],
  },
  'pearl-infusion-facial': {
    colors: ['Standard', 'Deluxe', 'Premium'],
    sizes: ['60 min', '90 min'],
  },
};

// Get variants for a specific product
export const getProductVariants = (productId) => {
  return productVariants[productId] || {
    colors: getDefaultColors(productId),
    sizes: getDefaultSizes(productId),
  };
};

// Get default colors based on category
const getDefaultColors = (productId) => {
  const product = highlightProducts.find((p) => p.id === productId);
  if (!product) return ['Black', 'Navy', 'Cream'];
  
  const categoryColors = {
    'Totes': ['Navy Blue', 'Cream', 'Sage Green'],
    'Handbags': ['Black', 'Cognac', 'Blush Pink'],
    'Backpacks': ['Black', 'Navy', 'Forest Green'],
    'Slides & Sandals': ['Black', 'White', 'Tan'],
    'Nike & Jordan': ['Black/White', 'Red/Black', 'Blue/White'],
    'Clothing': ['Navy', 'White', 'Sage'],
    'Beauty Spa Services': ['Standard', 'Deluxe', 'Premium'],
  };
  
  return categoryColors[product.category] || ['Black', 'Navy', 'Cream'];
};

// Get default sizes based on category
const getDefaultSizes = (productId) => {
  const product = highlightProducts.find((p) => p.id === productId);
  if (!product) return ['Standard'];
  
  if (product.category === 'Slides & Sandals' || product.category === 'Nike & Jordan') {
    return ['37', '38', '39', '40', '41', '42'];
  }
  if (product.category === 'Clothing') {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  }
  if (product.category === 'Beauty Spa Services') {
    return ['60 min', '90 min', '120 min'];
  }
  if (product.category.includes('Bag') || product.category === 'Totes' || product.category === 'Backpacks') {
    return ['Mini', 'Standard', 'Large', 'Extra Large'];
  }
  return ['Standard', 'Large'];
};

// Find related products (same product in different sizes)
export const findRelatedProducts = (currentProduct, selectedSize, allProducts = highlightProducts) => {
  if (!currentProduct || !selectedSize) return [];
  
  // For bags, find same product in different sizes
  if (
    currentProduct.category === 'Totes' ||
    currentProduct.category === 'Handbags' ||
    currentProduct.category === 'Backpacks' ||
    currentProduct.category === 'Shoulder Bags'
  ) {
    // Extract base product name (remove size indicators)
    const baseName = currentProduct.name
      .replace(/\s*(Mini|Standard|Large|Extra Large|XL)\s*/gi, '')
      .trim();
    
    // Find products with similar names in the same category
    const related = allProducts.filter((p) => {
      if (p.id === currentProduct.id) return false;
      if (p.category !== currentProduct.category) return false;
      
      const pBaseName = p.name
        .replace(/\s*(Mini|Standard|Large|Extra Large|XL)\s*/gi, '')
        .trim();
      
      // Check if names are similar (same base product)
      return (
        pBaseName.toLowerCase() === baseName.toLowerCase() ||
        baseName.toLowerCase().includes(pBaseName.toLowerCase()) ||
        pBaseName.toLowerCase().includes(baseName.toLowerCase())
      );
    });
    
    return related.slice(0, 4); // Return up to 4 related products
  }
  
  // For shoes, find same style in different sizes
  if (currentProduct.category === 'Slides & Sandals' || currentProduct.category === 'Nike & Jordan') {
    // Extract base product name (remove model numbers)
    const baseName = currentProduct.name
      .replace(/\s*(W\d+|HA\d+M|Size\s*\d+)\s*/gi, '')
      .trim();
    
    const related = allProducts.filter((p) => {
      if (p.id === currentProduct.id) return false;
      if (p.category !== currentProduct.category) return false;
      
      const pBaseName = p.name
        .replace(/\s*(W\d+|HA\d+M|Size\s*\d+)\s*/gi, '')
        .trim();
      
      return (
        pBaseName.toLowerCase() === baseName.toLowerCase() ||
        baseName.toLowerCase().includes(pBaseName.toLowerCase()) ||
        pBaseName.toLowerCase().includes(baseName.toLowerCase())
      );
    });
    
    return related.slice(0, 4);
  }
  
  // For clothing, find same item in different sizes
  if (currentProduct.category === 'Clothing') {
    const baseName = currentProduct.name
      .replace(/\s*(XS|S|M|L|XL|XXL)\s*/gi, '')
      .trim();
    
    const related = allProducts.filter((p) => {
      if (p.id === currentProduct.id) return false;
      if (p.category !== currentProduct.category) return false;
      
      const pBaseName = p.name
        .replace(/\s*(XS|S|M|L|XL|XXL)\s*/gi, '')
        .trim();
      
      return pBaseName.toLowerCase() === baseName.toLowerCase();
    });
    
    return related.slice(0, 4);
  }
  
  return [];
};

// Enhance product with variants
export const enhanceProductWithVariants = (product) => {
  const variants = getProductVariants(product.id);
  return {
    ...product,
    variants: {
      colors: variants.colors,
      sizes: variants.sizes,
    },
  };
};

