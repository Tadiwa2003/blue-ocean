#!/usr/bin/env node

/**
 * Populate MongoDB with Products and Services
 * This script imports data from frontend data files
 */

import { connectDB, disconnectDB } from './server/db/connection.js';
import Product from './server/models/Product.js';
import Service from './server/models/Service.js';
import { highlightProducts } from './src/data/products.js';
import crypto from 'crypto';

// Helper to parse price string to number
function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (typeof priceStr !== 'string') return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

// Generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function populateProducts() {
  try {
    console.log('📦 Populating products...');
    
    let created = 0;
    let skipped = 0;
    
    for (const product of highlightProducts) {
      try {
        // Skip spa services (they go to services collection)
        if (product.category === 'Beauty Spa Services') {
          continue;
        }
        
        // Check if product already exists
        const existing = await Product.findOne({ id: product.id });
        if (existing) {
          skipped++;
          continue;
        }
        
        // Generate slug if not provided
        const slug = product.slug || `${generateSlug(product.name)}-${crypto.randomUUID().substring(0, 8)}`;
        
        // Create product
        await Product.create({
          id: product.id,
          name: product.name,
          category: product.category,
          price: parsePrice(product.price),
          description: product.description || '',
          image: product.image || '',
          badges: product.badges || [],
          slug: slug,
        });
        
        created++;
      } catch (error) {
        console.error(`Error creating product ${product.id}:`, error.message);
      }
    }
    
    console.log(`✅ Products: ${created} created, ${skipped} skipped`);
    return { created, skipped };
  } catch (error) {
    console.error('Error populating products:', error);
    throw error;
  }
}

async function populateServices() {
  try {
    console.log('💆 Populating services...');
    
    // Extract spa services from products
    const spaServices = highlightProducts.filter(p => p.category === 'Beauty Spa Services');
    
    // Also add some default spa services
    const defaultServices = [
      {
        id: 'deep-tissue-massage',
        name: 'Deep Tissue Massage',
        serviceCategory: 'Massage',
        duration: 60,
        basePrice: 120,
        currency: 'USD',
        description: 'Intensive massage targeting deep muscle layers to relieve chronic tension and pain.',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80',
        badges: ['60 min'],
      },
      {
        id: 'hydrating-facial',
        name: 'Hydrating Facial',
        serviceCategory: 'Facial',
        duration: 50,
        basePrice: 95,
        currency: 'USD',
        description: 'Deeply hydrating facial treatment with hyaluronic acid and marine extracts.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
        badges: ['50 min'],
      },
      {
        id: 'full-body-scrub',
        name: 'Full Body Scrub',
        serviceCategory: 'Body Treatment',
        duration: 45,
        basePrice: 85,
        currency: 'USD',
        description: 'Exfoliating body treatment using sea salt and essential oils.',
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
        badges: ['45 min'],
      },
      {
        id: 'wellness-consultation',
        name: 'Wellness Consultation',
        serviceCategory: 'Wellness',
        duration: 30,
        basePrice: 60,
        currency: 'USD',
        description: 'Personalized wellness assessment and treatment plan.',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
        badges: ['30 min'],
      },
      {
        id: 'spa-day-package',
        name: 'Spa Day Package',
        serviceCategory: 'Spa Package',
        duration: 180,
        basePrice: 250,
        currency: 'USD',
        description: 'Complete spa experience including massage, facial, and body treatment.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
        badges: ['3 hours', 'Best value'],
      },
    ];
    
    // Map spa products to services
    const mappedServices = spaServices.map(product => {
      // Extract duration from badges if available
      const durationMatch = product.badges?.find(b => b.includes('min'));
      const duration = durationMatch ? parseInt(durationMatch) : 60;
      
      // Map category
      let serviceCategory = 'Massage';
      if (product.name.toLowerCase().includes('facial')) {
        serviceCategory = 'Facial';
      } else if (product.name.toLowerCase().includes('scrub') || product.name.toLowerCase().includes('polish')) {
        serviceCategory = 'Body Treatment';
      } else if (product.name.toLowerCase().includes('massage')) {
        serviceCategory = 'Massage';
      }
      
      return {
        id: product.id,
        name: product.name,
        serviceCategory: serviceCategory,
        duration: duration,
        basePrice: parsePrice(product.price),
        currency: 'USD',
        description: product.description || '',
        image: product.image || '',
        badges: product.badges || [],
      };
    });
    
    // Combine mapped and default services
    const allServices = [...mappedServices, ...defaultServices];
    
    let created = 0;
    let skipped = 0;
    
    for (const service of allServices) {
      try {
        // Check if service already exists
        const existing = await Service.findOne({ id: service.id });
        if (existing) {
          skipped++;
          continue;
        }
        
        // Create service
        await Service.create(service);
        created++;
      } catch (error) {
        console.error(`Error creating service ${service.id}:`, error.message);
      }
    }
    
    console.log(`✅ Services: ${created} created, ${skipped} skipped`);
    return { created, skipped };
  } catch (error) {
    console.error('Error populating services:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting database population...\n');
    
    // Connect to database
    await connectDB();
    console.log('');
    
    // Populate products
    const productsResult = await populateProducts();
    console.log('');
    
    // Populate services
    const servicesResult = await populateServices();
    console.log('');
    
    // Summary
    console.log('📊 Summary:');
    console.log(`   Products: ${productsResult.created} created, ${productsResult.skipped} skipped`);
    console.log(`   Services: ${servicesResult.created} created, ${servicesResult.skipped} skipped`);
    console.log('');
    
    // Verify
    const productCount = await Product.countDocuments();
    const serviceCount = await Service.countDocuments();
    console.log(`✅ Database now contains:`);
    console.log(`   ${productCount} products`);
    console.log(`   ${serviceCount} services`);
    console.log('');
    
    await disconnectDB();
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await disconnectDB();
    process.exit(1);
  }
}

main();

