# Quick Start Guide - Shopify-Style E-Commerce Platform

## 🚀 Getting Started

This guide will help you quickly set up and use the new Shopify-style features.

---

## 📦 What's Been Implemented

### ✅ Database Models
- **ProductEnhanced** - Products with variants, inventory, SKU
- **Customer** - Customer profiles with addresses and statistics
- **Collection** - Product collections (manual, automatic, smart)
- **Discount** - Discount codes and promotions
- **OrderEnhanced** - Complete order management

### ✅ Admin Dashboard Components
- **AdminDashboard** - Main dashboard with navigation
- **AnalyticsDashboard** - Sales analytics and charts
- **ProductManagement** - Product catalog management
- **OrderManagement** - Order processing and fulfillment
- **CustomerManagement** - Customer database
- **DiscountManagement** - Discount code management
- **StoreSettings** - Store configuration

### ✅ API Routes
- Customer management endpoints
- Ready for Product, Order, Collection, Discount endpoints

---

## 🛠️ Setup Instructions

### 1. Install Dependencies

All dependencies are already in `package.json`. If you need to reinstall:

```bash
npm install
```

### 2. Database Setup

The models are ready to use. Make sure MongoDB is running and connected.

### 3. Start the Server

```bash
npm run server
# or
npm run dev:server
```

### 4. Start the Frontend

```bash
npm run dev
```

### 5. Access Admin Dashboard

Import and use the AdminDashboard component:

```jsx
import { AdminDashboard } from './components/admin/AdminDashboard.jsx';

function App() {
  const storeId = 'your-store-id'; // Get from your storefront
  
  return (
    <AdminDashboard storeId={storeId} />
  );
}
```

---

## 📝 Using the New Models

### Creating a Product with Variants

```javascript
import ProductEnhanced from './models/ProductEnhanced.js';

const product = new ProductEnhanced({
  storeId: 'your-store-id',
  title: 'T-Shirt',
  description: 'A comfortable t-shirt',
  handle: 't-shirt',
  productType: 'Clothing',
  status: 'active',
  variants: [
    {
      title: 'Small / Blue',
      price: 29.99,
      sku: 'TSHIRT-S-BLUE',
      inventoryQuantity: 50,
      option1: 'Size: Small',
      option2: 'Color: Blue',
    },
    {
      title: 'Medium / Blue',
      price: 29.99,
      sku: 'TSHIRT-M-BLUE',
      inventoryQuantity: 30,
      option1: 'Size: Medium',
      option2: 'Color: Blue',
    },
  ],
  options: [
    { name: 'Size', values: ['Small', 'Medium', 'Large'] },
    { name: 'Color', values: ['Blue', 'Red', 'Green'] },
  ],
});

await product.save();
```

### Creating a Customer

```javascript
import Customer from './models/Customer.js';

const customer = new Customer({
  storeId: 'your-store-id',
  email: 'customer@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  addresses: [
    {
      type: 'shipping',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      province: 'NY',
      country: 'US',
      zip: '10001',
      isDefault: true,
    },
  ],
});

await customer.save();
```

### Creating a Collection

```javascript
import Collection from './models/Collection.js';

// Manual collection
const collection = new Collection({
  storeId: 'your-store-id',
  title: 'Summer Collection',
  handle: 'summer-collection',
  type: 'manual',
  products: [productId1, productId2, productId3],
});

await collection.save();

// Smart collection (automatic)
const smartCollection = new Collection({
  storeId: 'your-store-id',
  title: 'On Sale',
  handle: 'on-sale',
  type: 'smart',
  rules: [
    {
      column: 'variant_price',
      relation: 'less_than',
      condition: '50',
    },
  ],
});

await smartCollection.save();
```

### Creating a Discount

```javascript
import Discount from './models/Discount.js';

const discount = new Discount({
  storeId: 'your-store-id',
  title: 'Summer Sale',
  code: 'SUMMER20',
  discountType: 'percentage',
  value: 20,
  startsAt: new Date(),
  endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  usageLimit: 100,
  minimumOrderValue: 50,
});

await discount.save();
```

---

## 🔌 API Usage

### Customer API

```javascript
// Get all customers
GET /api/stores/:storeId/customers

// Get single customer
GET /api/stores/:storeId/customers/:customerId

// Create customer
POST /api/stores/:storeId/customers
Body: { email, firstName, lastName, ... }

// Update customer
PUT /api/stores/:storeId/customers/:customerId
Body: { ... }

// Delete customer
DELETE /api/stores/:storeId/customers/:customerId

// Add address
POST /api/stores/:storeId/customers/:customerId/addresses
Body: { type, address1, city, ... }

// Get customer stats
GET /api/stores/:storeId/stats
```

---

## 🎨 Using Admin Components

### Product Management

```jsx
import { ProductManagement } from './components/admin/ProductManagement.jsx';

<ProductManagement storeId={storeId} />
```

### Order Management

```jsx
import { OrderManagement } from './components/admin/OrderManagement.jsx';

<OrderManagement storeId={storeId} />
```

### Analytics Dashboard

```jsx
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard.jsx';

<AnalyticsDashboard storeId={storeId} />
```

---

## 🔄 Next Steps

1. **Connect Components to API**
   - Replace mock data in components with real API calls
   - Update `src/services/api.js` with new endpoints

2. **Create Remaining Controllers**
   - ProductEnhanced controller
   - Collection controller
   - Discount controller
   - OrderEnhanced controller

3. **Add Forms**
   - Product creation/edit form
   - Discount creation/edit form
   - Order fulfillment form

4. **Add Features**
   - User onboarding flow
   - Website builder
   - Payment integration
   - Email notifications

---

## 📚 Documentation

- **Full Specification:** `SHOPIFY_STYLE_IMPLEMENTATION.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
- **This Guide:** `QUICK_START.md`

---

## 🐛 Troubleshooting

### Models not found
Make sure you're importing from the correct path:
```javascript
import ProductEnhanced from '../models/ProductEnhanced.js';
```

### API routes not working
Check that routes are registered in `server/index.js`:
```javascript
app.use('/api', customerRoutes);
```

### Components not rendering
Make sure you have the required dependencies:
- React 18+
- Tailwind CSS
- Recharts (for analytics)
- Lucide React (for icons)

---

## 💡 Tips

1. **Start with Models** - Test the models first before building UI
2. **Use Mock Data** - Components have mock data - replace gradually
3. **Test API Endpoints** - Use Postman or similar to test APIs
4. **Check Console** - Look for errors in browser and server console
5. **Read Documentation** - Check the full specification for details

---

## 🎉 You're Ready!

You now have a solid foundation for a Shopify-style e-commerce platform. Start by connecting the components to your APIs and building out the remaining features!

For questions or issues, refer to the full documentation in `SHOPIFY_STYLE_IMPLEMENTATION.md`.

