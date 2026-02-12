# Leve Cottons - 70 Products Organization System test

## Overview
This system organizes exactly 70 products across 4 main categories with unique product codes and WhatsApp integration for seamless ordering.

## Product Organization

### Categories (70 Products Total)

#### 1. New Arrivals (20 Products)
- **Product Codes**: LC-NA-001 to LC-NA-020
- **Collections**: Festival, Silk, Luxury, Ethnic, Handloom, Designer, Cotton, Vintage, Indo-Western, Artisan, Modern, Bollywood, Heritage
- **Features**: Latest designs, trending colors, premium fabrics

#### 2. Best Sellers (20 Products)
- **Product Codes**: LC-BS-001 to LC-BS-020
- **Collections**: Luxury, Premium, Designer, Silk, Royal, Artisan, Heritage, Contemporary, Handloom, Indo-Western, Vintage, Festival
- **Features**: Most popular items, customer favorites, proven quality

#### 3. Collections (15 Products)
- **Product Codes**: LC-COL-001 to LC-COL-015
- **Collections**: Royal, Vintage, Block Print, Premium, Bridal, Contemporary, Designer, Silk, Festival, Indo-Western
- **Features**: Curated sets, themed collections, special editions

#### 4. Sale (15 Products)
- **Product Codes**: LC-SALE-001 to LC-SALE-015
- **Collections**: Premium, Indo-Western, Modern, Cotton, Designer, Ethnic, Royal, Heritage, Block Print, Handloom, Silk
- **Features**: 50% discount, original price shown, limited time offers

## Collections Available

1. **Festival Collection** - Traditional festive wear
2. **Silk Collection** - Premium silk sarees
3. **Luxury Collection** - High-end designer pieces
4. **Ethnic Collection** - Traditional ethnic wear
5. **Handloom Collection** - Handwoven sarees
6. **Designer Collection** - Contemporary designs
7. **Cotton Collection** - Comfortable cotton sarees
8. **Vintage Collection** - Classic vintage styles
9. **Indo-Western Collection** - Fusion wear
10. **Artisan Collection** - Handcrafted pieces
11. **Modern Collection** - Contemporary styles
12. **Bollywood Collection** - Bollywood-inspired designs
13. **Heritage Collection** - Traditional heritage pieces
14. **Royal Collection** - Regal and elegant designs
15. **Premium Collection** - High-quality premium sarees
16. **Contemporary Collection** - Modern contemporary styles
17. **Bridal Collection** - Wedding and bridal wear
18. **Block Print Collection** - Block printed designs

## Product Code System

### Format: LC-[CATEGORY]-[NUMBER]
- **LC**: Leve Cottons brand identifier
- **Category Codes**:
  - NA: New Arrivals
  - BS: Best Sellers
  - COL: Collections
  - SALE: Sale Items
- **Number**: Sequential 3-digit number (001-020 for most categories)

### Examples:
- `LC-NA-001`: Festival Saree (New Arrivals)
- `LC-BS-005`: Royal Collection Saree (Best Sellers)
- `LC-COL-003`: Block Print Saree (Collections)
- `LC-SALE-001`: Premium Georgette Saree (Sale - 50% OFF)

## WhatsApp Integration

### Features:
1. **Product Inquiry**: Automatic message with product details
2. **Order Placement**: Complete order form with customer details
3. **Product Code Inclusion**: All messages include unique product codes
4. **Order Details**: Comprehensive order information sent to WhatsApp

### WhatsApp Message Format:

#### Product Inquiry:
```
🌟 *LEVE COTTONS* 🌟

📦 *Product Code:* LC-NA-001
👗 *Product:* Festival Saree
💰 *Price:* ₹2,220
🎨 *Color:* Yellow
🧵 *Fabric:* Crepe
📂 *Collection:* Festival Collection
📝 *Description:* Beautiful chiffon saree with intricate design and premium quality finish

✅ *In Stock: Available*

🛒 *I'm interested in this saree. Please share more details!*
```

#### Order Placement:
```
🛍️ *NEW ORDER - LEVE COTTONS* 🛍️

👤 *Customer Details:*
Name: [Customer Name]
Phone: [Phone Number]
Address: [Address]

📦 *Order Details:*
Product Code: LC-NA-001
Product: Festival Saree
Price: ₹2,220
Color: Yellow
Fabric: Crepe
Collection: Festival Collection
Quantity: 1

💳 *Total Amount: ₹2,220*

📅 *Order Date: [Current Date]*
🕐 *Order Time: [Current Time]*
```

## API Endpoints

### GET /api/products
- **Parameters**:
  - `filter`: Category filter (new-arrivals, best-sellers, collections, sale)
  - `collection`: Collection filter (Festival Collection, Silk Collection, etc.)
  - `page`: Page number for pagination
  - `limit`: Number of products per page

### POST /api/products
- **Actions**:
  - `getProductForWhatsApp`: Get formatted WhatsApp message for product inquiry
  - `createOrder`: Create formatted WhatsApp message for order placement

## Components

### 1. ProductCard
- Displays product with code, collection, and pricing
- Integrated WhatsApp buttons for inquiry and ordering
- Order form modal for customer details

### 2. WhatsAppButton
- Multiple types: inquiry, order, general
- Automatic message formatting
- Product code integration

### 3. CategoryNav
- Navigation between categories
- Collection browsing
- Product count display

### 4. Enhanced Collections Page
- Filter by collections
- Product code display
- WhatsApp integration

## File Structure

```
/app
  /api
    /products
      route.ts (70 products with codes and WhatsApp integration)
  /collections
    /enhanced
      page.tsx (Enhanced collections page)
    page.tsx (Original collections page)
  /new-arrivals
    page.tsx
  /best-sellers
    page.tsx
  /sale
    page.tsx

/components
  ProductCard.tsx (Product display with codes and WhatsApp)
  WhatsAppButton.tsx (Enhanced WhatsApp integration)
  CategoryNav.tsx (Category navigation)

/public
  /products
    1.jpg to 97.jpg (Product images)
```

## Usage Instructions

1. **Browse Products**: Use category navigation to explore 70 products
2. **View Collections**: Filter by specific collections
3. **Product Codes**: Each product displays unique LC code
4. **WhatsApp Inquiry**: Click WhatsApp button on any product for instant inquiry
5. **Place Orders**: Use "Order Now" button to fill customer details and send via WhatsApp
6. **Track Orders**: Product codes included in all WhatsApp communications

## Benefits

1. **Organized Catalog**: 70 products systematically organized
2. **Unique Identification**: Every product has a unique code
3. **Easy Ordering**: WhatsApp integration with automatic formatting
4. **Professional Communication**: Structured messages with all details
5. **Customer Convenience**: One-click inquiry and ordering
6. **Business Efficiency**: Automated order processing via WhatsApp

This system ensures all 70 products are properly categorized, coded, and accessible through both the website navigation and WhatsApp ordering system.