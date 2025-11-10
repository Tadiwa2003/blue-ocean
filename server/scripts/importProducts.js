/**
 * Script to import products from frontend data file to backend
 * Run this once to populate the backend with products
 */

import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import products from frontend using dynamic import
async function importProducts() {
  try {
    // Dynamically import the frontend modules
    const productsModule = await import('../../src/data/products.js');
    const servicesModule = await import('../../src/data/spaServices.js');
    
    // Extract the exported arrays
    const products = productsModule.highlightProducts || [];
    const services = servicesModule.spaServices || [];
    
    if (products.length > 0) {
      // Save to backend data file
      const backendProductsPath = join(__dirname, '../data/products.json');
      await writeFile(backendProductsPath, JSON.stringify(products, null, 2), 'utf8');
      console.log(`✅ Imported ${products.length} products`);
    } else {
      console.log('⚠️  No products found to import');
    }
    
    if (services.length > 0) {
      // Save to backend data file
      const backendServicesPath = join(__dirname, '../data/services.json');
      await writeFile(backendServicesPath, JSON.stringify(services, null, 2), 'utf8');
      console.log(`✅ Imported ${services.length} services`);
    } else {
      console.log('⚠️  No services found to import');
    }
    
    console.log('✅ Import complete!');
  } catch (error) {
    console.error('❌ Error importing products/services:', error);
    process.exit(1);
  }
}

// Run the import
importProducts();

