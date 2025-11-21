#!/usr/bin/env node

/**
 * Create Anaya Finds Storefront
 * This script creates a complete storefront for Anaya Finds with products
 */

import { connectDB, disconnectDB } from './server/db/connection.js';
import Storefront from './server/models/Storefront.js';
import Product from './server/models/Product.js';
import User from './server/models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Anaya Finds brand colors - elegant and sophisticated
const ANAYA_COLORS = {
    primary: '#d4af37', // Gold
    secondary: '#2c1810', // Dark brown
    accent: '#f5f5dc', // Beige
};

// Sample products for Anaya Finds - curated fashion items
const ANAYA_PRODUCTS = [
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Silk Wrap Dress',
        category: 'Clothing',
        price: 189.99,
        description: 'Elegant silk wrap dress perfect for any occasion. Features adjustable waist tie and flowing silhouette.',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
        badges: ['New Arrival', 'Premium'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Leather Crossbody Bag',
        category: 'Handbags',
        price: 149.99,
        description: 'Handcrafted Italian leather crossbody bag with adjustable strap. Perfect size for everyday essentials.',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
        badges: ['Bestseller', 'Handmade'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Gold Hoop Earrings',
        category: 'Jewelry',
        price: 79.99,
        description: 'Classic 14k gold-plated hoop earrings. Timeless design that complements any outfit.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
        badges: ['14k Gold', 'Classic'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Linen Wide-Leg Pants',
        category: 'Clothing',
        price: 129.99,
        description: 'Breathable linen wide-leg pants with elastic waistband. Perfect for warm weather and effortless style.',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
        badges: ['Sustainable', 'Comfort Fit'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Structured Tote Bag',
        category: 'Totes',
        price: 169.99,
        description: 'Spacious structured tote bag with interior pockets. Professional and stylish for work or travel.',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
        badges: ['Professional', 'Spacious'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Cashmere Scarf',
        category: 'Accessories',
        price: 99.99,
        description: 'Luxuriously soft cashmere scarf in neutral tones. Adds warmth and elegance to any outfit.',
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80',
        badges: ['Cashmere', 'Luxury'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Suede Ankle Boots',
        category: 'Slides & Sandals',
        price: 219.99,
        description: 'Premium suede ankle boots with block heel. Versatile style that transitions from day to night.',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
        badges: ['Premium Suede', 'Comfortable'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Minimalist Watch',
        category: 'Accessories',
        price: 159.99,
        description: 'Sleek minimalist watch with leather strap. Timeless design with precision movement.',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80',
        badges: ['Swiss Movement', 'Minimalist'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Silk Blouse',
        category: 'Clothing',
        price: 139.99,
        description: 'Elegant silk blouse with subtle sheen. Features button front and relaxed fit.',
        image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=900&q=80',
        badges: ['Pure Silk', 'Elegant'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Statement Necklace',
        category: 'Jewelry',
        price: 89.99,
        description: 'Bold statement necklace with geometric design. Elevates any simple outfit.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
        badges: ['Statement Piece', 'Unique'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Leather Shoulder Bag',
        category: 'Shoulder Bags',
        price: 199.99,
        description: 'Classic leather shoulder bag with gold hardware. Timeless design with modern functionality.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
        badges: ['Genuine Leather', 'Classic'],
    },
    {
        id: `anaya-${crypto.randomUUID().substring(0, 8)}`,
        name: 'Tailored Blazer',
        category: 'Clothing',
        price: 249.99,
        description: 'Perfectly tailored blazer in premium fabric. Essential piece for a polished wardrobe.',
        image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=80',
        badges: ['Tailored', 'Premium Fabric'],
    },
];

async function createAnayaUser() {
    try {
        console.log('👤 Creating Anaya Finds user account...');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'anaya@anayafinds.com' });
        if (existingUser) {
            console.log('✅ User already exists:', existingUser.email);
            return existingUser;
        }

        // Create new user
        const password = process.env.ANAYA_PASSWORD || 'anaya2024';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            id: `user_anaya_${crypto.randomUUID().substring(0, 8)}`,
            name: 'Anaya Finds',
            email: 'anaya@anayafinds.com',
            password: hashedPassword,
            role: 'user',
        });

        console.log('✅ User created:', user.email);
        console.log(`   Login credentials: anaya@anayafinds.com / ${password}`);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function createAnayaStorefront(userId) {
    try {
        console.log('\n🏪 Creating Anaya Finds storefront...');

        // Check if storefront already exists
        const existingStorefront = await Storefront.findOne({
            userId: userId,
            name: 'Anaya Finds'
        });

        if (existingStorefront) {
            console.log('✅ Storefront already exists:', existingStorefront.name);
            return existingStorefront;
        }

        // Create storefront
        const storefront = await Storefront.create({
            userId: userId,
            name: 'Anaya Finds',
            type: 'products',
            design: {
                hero: {
                    title: 'Curated Fashion for the Modern Woman',
                    subtitle: 'Discover timeless pieces that elevate your everyday style',
                    backgroundColor: ANAYA_COLORS.secondary,
                    backgroundImage: '',
                    showLogo: true,
                    logoSize: 'large',
                },
                colors: ANAYA_COLORS,
                layout: {
                    productCardStyle: 'modern',
                    gridColumns: 3,
                },
                branding: {
                    storeName: 'Anaya Finds',
                    tagline: 'Elegance in Every Detail',
                    logo: '',
                },
            },
            settings: {
                showCategories: true,
                showSearch: true,
                showCart: true,
                enableCheckout: true,
            },
            seo: {
                title: 'Anaya Finds - Curated Fashion & Accessories',
                description: 'Shop curated fashion, handbags, jewelry, and accessories. Timeless pieces for the modern woman.',
                keywords: ['fashion', 'handbags', 'jewelry', 'accessories', 'women\'s clothing', 'luxury'],
            },
            isPublished: false,
        });

        console.log('✅ Storefront created:', storefront.name);
        console.log('   Slug:', storefront.slug);
        return storefront;
    } catch (error) {
        console.error('Error creating storefront:', error);
        throw error;
    }
}

async function addProductsToStorefront(userId, storefrontId) {
    try {
        console.log('\n📦 Adding products to Anaya Finds...');

        let created = 0;
        let skipped = 0;

        for (const productData of ANAYA_PRODUCTS) {
            try {
                // Check if product already exists
                const existing = await Product.findOne({ id: productData.id });
                if (existing) {
                    skipped++;
                    continue;
                }

                // Generate slug
                const slug = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${crypto.randomUUID().substring(0, 8)}`;

                // Create product
                await Product.create({
                    ...productData,
                    userId: userId,
                    storefrontId: storefrontId,
                    slug: slug,
                });

                created++;
            } catch (error) {
                console.error(`Error creating product ${productData.name}:`, error.message);
            }
        }

        console.log(`✅ Products: ${created} created, ${skipped} skipped`);
        return { created, skipped };
    } catch (error) {
        console.error('Error adding products:', error);
        throw error;
    }
}

async function publishStorefront(storefrontId) {
    try {
        console.log('\n🚀 Publishing Anaya Finds storefront...');

        const storefront = await Storefront.findById(storefrontId);
        if (!storefront) {
            throw new Error('Storefront not found');
        }

        storefront.isPublished = true;
        storefront.publishedAt = new Date();
        await storefront.save();

        console.log('✅ Storefront published successfully!');
        console.log(`   Public URL: http://localhost:5178/storefront/${storefront.slug}`);
        return storefront;
    } catch (error) {
        console.error('Error publishing storefront:', error);
        throw error;
    }
}

async function main() {
    try {
        console.log('🎨 Creating Anaya Finds Storefront\n');
        console.log('='.repeat(50));

        // Connect to database
        await connectDB();
        console.log('');

        // Create user
        const user = await createAnayaUser();

        // Create storefront
        const storefront = await createAnayaStorefront(user.id);

        // Add products
        const productsResult = await addProductsToStorefront(user.id, storefront._id);

        // Publish storefront
        await publishStorefront(storefront._id);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 Summary:');
        console.log(`   User: ${user.email}`);
        console.log(`   Storefront: ${storefront.name}`);
        console.log(`   Products: ${productsResult.created} added`);
        console.log(`   Status: Published ✅`);
        console.log('');
        console.log('🎉 Anaya Finds is ready!');
        console.log('');
        console.log('📝 Login Credentials:');
        console.log(`   Email: anaya@anayafinds.com`);
        console.log(`   Password: ${process.env.ANAYA_PASSWORD || 'anaya2024'}`);
        console.log('');
        console.log('🌐 Storefront URL:');
        console.log(`   http://localhost:5178/storefront/${storefront.slug}`);
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
