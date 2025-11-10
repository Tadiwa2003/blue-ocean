/**
 * Script to import products from frontend data file to backend
 * Run this once to populate the backend with products
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import products from frontend
const frontendProductsPath = join(__dirname, '../../src/data/products.js');
const frontendServicesPath = join(__dirname, '../../src/data/spaServices.js');

// Read and parse the products file
const productsContent = readFileSync(frontendProductsPath, 'utf8');
const servicesContent = readFileSync(frontendServicesPath, 'utf8');

// Extract products array (simple regex extraction - in production use proper parser)
const productsMatch = productsContent.match(/export const highlightProducts = (\[[\s\S]*?\]);/);
const servicesMatch = servicesContent.match(/export const spaServices = (\[[\s\S]*?\]);/);

if (productsMatch) {
  // Evaluate the products array (safe in this context)
  const products = eval(productsMatch[1]);
  
  // Save to backend data file
  const backendProductsPath = join(__dirname, '../data/products.json');
  writeFileSync(backendProductsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`✅ Imported ${products.length} products`);
}

if (servicesMatch) {
  // Evaluate the services array
  const services = eval(servicesMatch[1]);
  
  // Save to backend data file
  const backendServicesPath = join(__dirname, '../data/services.json');
  writeFileSync(backendServicesPath, JSON.stringify(services, null, 2), 'utf8');
  console.log(`✅ Imported ${services.length} services`);
}

console.log('✅ Import complete!');

