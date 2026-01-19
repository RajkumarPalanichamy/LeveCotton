import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Default products data
const defaultProducts = [
  // New Arrivals (20 products)
  { "id": "prod_1", "productCode": "LC-NA-001", "name": "Festival Saree", "price": 2220, "image": "/products/1.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Festival Collection", "color": "Yellow", "fabric": "Crepe", "inStock": true },
  { "id": "prod_5", "productCode": "LC-NA-002", "name": "Embroidered Silk Saree", "price": 6658, "image": "/products/5.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Silk Collection", "color": "Pink", "fabric": "Georgette", "inStock": true },
  { "id": "prod_9", "productCode": "LC-NA-003", "name": "Festive Wear Saree", "price": 10696, "image": "/products/9.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Festival Collection", "color": "White", "fabric": "Silk", "inStock": true },
  { "id": "prod_13", "productCode": "LC-NA-004", "name": "Ethnic Wear Saree", "price": 8660, "image": "/products/13.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Ethnic Collection", "color": "Purple", "fabric": "Crepe", "inStock": true },
  { "id": "prod_17", "productCode": "LC-NA-005", "name": "Luxury Silk Saree", "price": 9456, "image": "/products/17.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Luxury Collection", "color": "Purple", "fabric": "Crepe", "inStock": true },
  { "id": "prod_21", "productCode": "LC-NA-006", "name": "Classic Handloom Saree", "price": 11222, "image": "/products/21.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Handloom Collection", "color": "Maroon", "fabric": "Rayon", "inStock": true },
  { "id": "prod_25", "productCode": "LC-NA-007", "name": "Mirror Work Saree", "price": 5897, "image": "/products/25.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Designer Collection", "color": "Gold", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_29", "productCode": "LC-NA-008", "name": "Traditional Cotton Saree", "price": 6390, "image": "/products/29.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Cotton Collection", "color": "Pink", "fabric": "Rayon", "inStock": true },
  { "id": "prod_33", "productCode": "LC-NA-009", "name": "Elegant Silk Saree", "price": 9670, "image": "/products/33.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Silk Collection", "color": "Blue", "fabric": "Silk", "inStock": true },
  { "id": "prod_37", "productCode": "LC-NA-010", "name": "Vintage Style Saree", "price": 5526, "image": "/products/37.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Vintage Collection", "color": "Black", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_41", "productCode": "LC-NA-011", "name": "Indo-Western Saree", "price": 6051, "image": "/products/41.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Indo-Western Collection", "color": "White", "fabric": "Rayon", "inStock": true },
  { "id": "prod_45", "productCode": "LC-NA-012", "name": "Artisan Craft Saree", "price": 9602, "image": "/products/45.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Artisan Collection", "color": "Red", "fabric": "Georgette", "inStock": true },
  { "id": "prod_49", "productCode": "LC-NA-013", "name": "Printed Designer Saree", "price": 7783, "image": "/products/49.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Designer Collection", "color": "Yellow", "fabric": "Georgette", "inStock": true },
  { "id": "prod_53", "productCode": "LC-NA-014", "name": "Embroidered Silk Saree", "price": 9800, "image": "/products/53.jpg", "description": "Beautiful crepe saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Silk Collection", "color": "White", "fabric": "Silk", "inStock": true },
  { "id": "prod_57", "productCode": "LC-NA-015", "name": "Modern Fusion Saree", "price": 5678, "image": "/products/57.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Modern Collection", "color": "Teal", "fabric": "Crepe", "inStock": true },
  { "id": "prod_61", "productCode": "LC-NA-016", "name": "Ethnic Wear Saree", "price": 11103, "image": "/products/61.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Ethnic Collection", "color": "Orange", "fabric": "Rayon", "inStock": true },
  { "id": "prod_65", "productCode": "LC-NA-017", "name": "Bollywood Style Saree", "price": 4438, "image": "/products/65.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Bollywood Collection", "color": "Black", "fabric": "Crepe", "inStock": true },
  { "id": "prod_69", "productCode": "LC-NA-018", "name": "Heritage Series Saree", "price": 4256, "image": "/products/69.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Heritage Collection", "color": "Teal", "fabric": "Silk", "inStock": true },
  { "id": "prod_73", "productCode": "LC-NA-019", "name": "Embroidered Silk Saree", "price": 8563, "image": "/products/73.jpg", "description": "Beautiful crepe saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Silk Collection", "color": "Black", "fabric": "Crepe", "inStock": true },
  { "id": "prod_77", "productCode": "LC-NA-020", "name": "Vintage Style Saree", "price": 10299, "image": "/products/77.jpg", "description": "Beautiful crepe saree with intricate design and premium quality finish", "category": "new-arrivals", "collection": "Vintage Collection", "color": "Pink", "fabric": "Cotton", "inStock": true },

  // Best Sellers (20 products)
  { "id": "prod_2", "productCode": "LC-BS-001", "name": "Luxury Silk Saree", "price": 10043, "image": "/products/2.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Luxury Collection", "color": "Black", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_6", "productCode": "LC-BS-002", "name": "Premium Georgette Saree", "price": 17439, "image": "/products/6.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Premium Collection", "color": "Maroon", "fabric": "Georgette", "inStock": true },
  { "id": "prod_10", "productCode": "LC-BS-003", "name": "Printed Designer Saree", "price": 9494, "image": "/products/10.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Designer Collection", "color": "Black", "fabric": "Rayon", "inStock": true },
  { "id": "prod_14", "productCode": "LC-BS-004", "name": "Embroidered Silk Saree", "price": 17681, "image": "/products/14.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Silk Collection", "color": "Black", "fabric": "Rayon", "inStock": true },
  { "id": "prod_18", "productCode": "LC-BS-005", "name": "Royal Collection Saree", "price": 12891, "image": "/products/18.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Royal Collection", "color": "Blue", "fabric": "Crepe", "inStock": true },
  { "id": "prod_22", "productCode": "LC-BS-006", "name": "Artisan Craft Saree", "price": 13172, "image": "/products/22.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Artisan Collection", "color": "Gold", "fabric": "Crepe", "inStock": true },
  { "id": "prod_26", "productCode": "LC-BS-007", "name": "Heritage Series Saree", "price": 15711, "image": "/products/26.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Heritage Collection", "color": "Purple", "fabric": "Rayon", "inStock": true },
  { "id": "prod_30", "productCode": "LC-BS-008", "name": "Elegant Silk Saree", "price": 7207, "image": "/products/30.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Silk Collection", "color": "Pink", "fabric": "Cotton", "inStock": true },
  { "id": "prod_34", "productCode": "LC-BS-009", "name": "Contemporary Style Saree", "price": 6006, "image": "/products/34.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Contemporary Collection", "color": "Black", "fabric": "Crepe", "inStock": true },
  { "id": "prod_38", "productCode": "LC-BS-010", "name": "Heritage Series Saree", "price": 13353, "image": "/products/38.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Heritage Collection", "color": "White", "fabric": "Cotton", "inStock": true },
  { "id": "prod_42", "productCode": "LC-BS-011", "name": "Embroidered Silk Saree", "price": 14916, "image": "/products/42.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Silk Collection", "color": "Black", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_46", "productCode": "LC-BS-012", "name": "Vintage Style Saree", "price": 10201, "image": "/products/46.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Vintage Collection", "color": "Black", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_50", "productCode": "LC-BS-013", "name": "Luxury Silk Saree", "price": 13962, "image": "/products/50.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Luxury Collection", "color": "Maroon", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_54", "productCode": "LC-BS-014", "name": "Classic Handloom Saree", "price": 10217, "image": "/products/54.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Handloom Collection", "color": "White", "fabric": "Cotton", "inStock": true },
  { "id": "prod_58", "productCode": "LC-BS-015", "name": "Classic Handloom Saree", "price": 11329, "image": "/products/58.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Handloom Collection", "color": "Black", "fabric": "Silk", "inStock": true },
  { "id": "prod_62", "productCode": "LC-BS-016", "name": "Elegant Silk Saree", "price": 8893, "image": "/products/62.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Silk Collection", "color": "Black", "fabric": "Rayon", "inStock": true },
  { "id": "prod_66", "productCode": "LC-BS-017", "name": "Indo-Western Saree", "price": 13161, "image": "/products/66.jpg", "description": "Beautiful crepe saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Indo-Western Collection", "color": "Green", "fabric": "Rayon", "inStock": true },
  { "id": "prod_70", "productCode": "LC-BS-018", "name": "Royal Collection Saree", "price": 14626, "image": "/products/70.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Royal Collection", "color": "Orange", "fabric": "Crepe", "inStock": true },
  { "id": "prod_74", "productCode": "LC-BS-019", "name": "Premium Georgette Saree", "price": 10055, "image": "/products/74.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Premium Collection", "color": "Pink", "fabric": "Silk", "inStock": true },
  { "id": "prod_78", "productCode": "LC-BS-020", "name": "Festive Wear Saree", "price": 13710, "image": "/products/78.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "best-sellers", "collection": "Festival Collection", "color": "Green", "fabric": "Crepe", "inStock": true },

  // Collections (15 products)
  { "id": "prod_3", "productCode": "LC-COL-001", "name": "Royal Collection Saree", "price": 20991, "image": "/products/3.jpg", "description": "Beautiful crepe saree with intricate design and premium quality finish", "category": "collections", "collection": "Royal Collection", "color": "Red", "fabric": "Silk", "inStock": true },
  { "id": "prod_7", "productCode": "LC-COL-002", "name": "Vintage Style Saree", "price": 12769, "image": "/products/7.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "collections", "collection": "Vintage Collection", "color": "Teal", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_11", "productCode": "LC-COL-003", "name": "Block Print Saree", "price": 20647, "image": "/products/11.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "collections", "collection": "Block Print Collection", "color": "White", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_15", "productCode": "LC-COL-004", "name": "Premium Georgette Saree", "price": 20732, "image": "/products/15.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "collections", "collection": "Premium Collection", "color": "Orange", "fabric": "Crepe", "inStock": true },
  { "id": "prod_19", "productCode": "LC-COL-005", "name": "Bridal Collection Saree", "price": 12649, "image": "/products/19.jpg", "description": "Beautiful crepe saree with intricate design and premium quality finish", "category": "collections", "collection": "Bridal Collection", "color": "Green", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_23", "productCode": "LC-COL-006", "name": "Bridal Collection Saree", "price": 22499, "image": "/products/23.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "collections", "collection": "Bridal Collection", "color": "Maroon", "fabric": "Crepe", "inStock": true },
  { "id": "prod_27", "productCode": "LC-COL-007", "name": "Premium Georgette Saree", "price": 27431, "image": "/products/27.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "collections", "collection": "Premium Collection", "color": "Maroon", "fabric": "Rayon", "inStock": true },
  { "id": "prod_31", "productCode": "LC-COL-008", "name": "Contemporary Style Saree", "price": 18360, "image": "/products/31.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "collections", "collection": "Contemporary Collection", "color": "Red", "fabric": "Silk", "inStock": true },
  { "id": "prod_35", "productCode": "LC-COL-009", "name": "Mirror Work Saree", "price": 21746, "image": "/products/35.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "collections", "collection": "Designer Collection", "color": "Black", "fabric": "Cotton", "inStock": true },
  { "id": "prod_39", "productCode": "LC-COL-010", "name": "Elegant Silk Saree", "price": 23973, "image": "/products/39.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "collections", "collection": "Silk Collection", "color": "Yellow", "fabric": "Cotton", "inStock": true },
  { "id": "prod_43", "productCode": "LC-COL-011", "name": "Bridal Collection Saree", "price": 14488, "image": "/products/43.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "collections", "collection": "Bridal Collection", "color": "Purple", "fabric": "Georgette", "inStock": true },
  { "id": "prod_47", "productCode": "LC-COL-012", "name": "Festive Wear Saree", "price": 10412, "image": "/products/47.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "collections", "collection": "Festival Collection", "color": "Red", "fabric": "Crepe", "inStock": true },
  { "id": "prod_51", "productCode": "LC-COL-013", "name": "Indo-Western Saree", "price": 13372, "image": "/products/51.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "collections", "collection": "Indo-Western Collection", "color": "Pink", "fabric": "Crepe", "inStock": true },
  { "id": "prod_55", "productCode": "LC-COL-014", "name": "Bridal Collection Saree", "price": 10532, "image": "/products/55.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "collections", "collection": "Bridal Collection", "color": "Green", "fabric": "Chiffon", "inStock": true },
  { "id": "prod_59", "productCode": "LC-COL-015", "name": "Indo-Western Saree", "price": 12109, "image": "/products/59.jpg", "description": "Beautiful crepe saree with intricate design and premium quality finish", "category": "collections", "collection": "Indo-Western Collection", "color": "Pink", "fabric": "Chiffon", "inStock": true },

  // Sale (15 products)
  { "id": "prod_4", "productCode": "LC-SALE-001", "name": "Premium Georgette Saree", "price": 4356, "originalPrice": 8712, "image": "/products/4.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "sale", "collection": "Premium Collection", "color": "Purple", "fabric": "Rayon", "inStock": true, "discount": 50 },
  { "id": "prod_8", "productCode": "LC-SALE-002", "name": "Indo-Western Saree", "price": 5505, "originalPrice": 11010, "image": "/products/8.jpg", "description": "Beautiful silk saree with intricate design and premium quality finish", "category": "sale", "collection": "Indo-Western Collection", "color": "Pink", "fabric": "Cotton", "inStock": true, "discount": 50 },
  { "id": "prod_12", "productCode": "LC-SALE-003", "name": "Modern Fusion Saree", "price": 2615, "originalPrice": 5230, "image": "/products/12.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "sale", "collection": "Modern Collection", "color": "Green", "fabric": "Crepe", "inStock": true, "discount": 50 },
  { "id": "prod_16", "productCode": "LC-SALE-004", "name": "Handwoven Cotton Saree", "price": 5277, "originalPrice": 10554, "image": "/products/16.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "sale", "collection": "Cotton Collection", "color": "Yellow", "fabric": "Cotton", "inStock": true, "discount": 50 },
  { "id": "prod_20", "productCode": "LC-SALE-005", "name": "Zari Work Saree", "price": 3706, "originalPrice": 7412, "image": "/products/20.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "sale", "collection": "Designer Collection", "color": "Teal", "fabric": "Silk", "inStock": true, "discount": 50 },
  { "id": "prod_24", "productCode": "LC-SALE-006", "name": "Ethnic Wear Saree", "price": 5341, "originalPrice": 10682, "image": "/products/24.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "sale", "collection": "Ethnic Collection", "color": "Black", "fabric": "Cotton", "inStock": true, "discount": 50 },
  { "id": "prod_28", "productCode": "LC-SALE-007", "name": "Royal Collection Saree", "price": 4662, "originalPrice": 9324, "image": "/products/28.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "sale", "collection": "Royal Collection", "color": "Blue", "fabric": "Georgette", "inStock": true, "discount": 50 },
  { "id": "prod_32", "productCode": "LC-SALE-008", "name": "Traditional Cotton Saree", "price": 2985, "originalPrice": 5970, "image": "/products/32.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "sale", "collection": "Cotton Collection", "color": "Yellow", "fabric": "Silk", "inStock": true, "discount": 50 },
  { "id": "prod_36", "productCode": "LC-SALE-009", "name": "Heritage Series Saree", "price": 5737, "originalPrice": 11474, "image": "/products/36.jpg", "description": "Beautiful chiffon saree with intricate design and premium quality finish", "category": "sale", "collection": "Heritage Collection", "color": "Black", "fabric": "Rayon", "inStock": true, "discount": 50 },
  { "id": "prod_40", "productCode": "LC-SALE-010", "name": "Vintage Style Saree", "price": 5905, "originalPrice": 11810, "image": "/products/40.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "sale", "collection": "Vintage Collection", "color": "Blue", "fabric": "Cotton", "inStock": true, "discount": 50 },
  { "id": "prod_44", "productCode": "LC-SALE-011", "name": "Traditional Cotton Saree", "price": 4101, "originalPrice": 8202, "image": "/products/44.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "sale", "collection": "Cotton Collection", "color": "Teal", "fabric": "Crepe", "inStock": true, "discount": 50 },
  { "id": "prod_48", "productCode": "LC-SALE-012", "name": "Elegant Silk Saree", "price": 2270, "originalPrice": 4540, "image": "/products/48.jpg", "description": "Beautiful rayon saree with intricate design and premium quality finish", "category": "sale", "collection": "Silk Collection", "color": "Blue", "fabric": "Rayon", "inStock": true, "discount": 50 },
  { "id": "prod_52", "productCode": "LC-SALE-013", "name": "Block Print Saree", "price": 2705, "originalPrice": 5410, "image": "/products/52.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "sale", "collection": "Block Print Collection", "color": "Black", "fabric": "Chiffon", "inStock": true, "discount": 50 },
  { "id": "prod_56", "productCode": "LC-SALE-014", "name": "Modern Fusion Saree", "price": 3578, "originalPrice": 7156, "image": "/products/56.jpg", "description": "Beautiful cotton saree with intricate design and premium quality finish", "category": "sale", "collection": "Modern Collection", "color": "Purple", "fabric": "Silk", "inStock": true, "discount": 50 },
  { "id": "prod_60", "productCode": "LC-SALE-015", "name": "Classic Handloom Saree", "price": 2009, "originalPrice": 4018, "image": "/products/60.jpg", "description": "Beautiful georgette saree with intricate design and premium quality finish", "category": "sale", "collection": "Handloom Collection", "color": "Gold", "fabric": "Georgette", "inStock": true, "discount": 50 }
];

// Get products from database
async function getProducts() {
  try {
    const client = await clientPromise;
    const db = client.db('levecotton');
    const products = await db.collection('products').find({}).toArray();
    
    if (products.length === 0) {
      // Initialize with default products
      await db.collection('products').insertMany(defaultProducts);
      return defaultProducts;
    }
    
    return products;
  } catch (error) {
    console.error('Database error:', error);
    return defaultProducts;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');
  const collection = searchParams.get('collection');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '70');
  
  const productData = await getProducts();
  let filteredProducts = productData;
  
  // Filter by category
  if (filter) {
    filteredProducts = productData.filter(product => product.category === filter);
  }
  
  // Filter by collection
  if (collection) {
    filteredProducts = filteredProducts.filter(product => 
      product.collection && product.collection.toLowerCase().includes(collection.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  console.log(`API called with filter: ${filter}, collection: ${collection}, page: ${page}, returning ${paginatedProducts.length} products`);
  
  return NextResponse.json({ 
    products: paginatedProducts,
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
    categories: {
      'new-arrivals': productData.filter(p => p.category === 'new-arrivals').length,
      'best-sellers': productData.filter(p => p.category === 'best-sellers').length,
      'collections': productData.filter(p => p.category === 'collections').length,
      'sale': productData.filter(p => p.category === 'sale').length
    },
    collections: [
      'Festival Collection',
      'Silk Collection', 
      'Luxury Collection',
      'Ethnic Collection',
      'Handloom Collection',
      'Designer Collection',
      'Cotton Collection',
      'Vintage Collection',
      'Indo-Western Collection',
      'Artisan Collection',
      'Modern Collection',
      'Bollywood Collection',
      'Heritage Collection',
      'Royal Collection',
      'Premium Collection',
      'Contemporary Collection',
      'Bridal Collection',
      'Block Print Collection'
    ]
  });
}

// Get product by ID for WhatsApp sharing
export async function POST(request: NextRequest) {
  try {
    const { action, productId, customerInfo } = await request.json();
    const productData = await getProducts();
    
    if (action === 'getProductForWhatsApp') {
      const product = productData.find((p: any) => p.id === productId);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      const whatsappMessage = `🌟 *LEVE COTTONS* 🌟\n\n` +
        `📦 *Product Code:* ${product.productCode}\n` +
        `👗 *Product:* ${product.name}\n` +
        `💰 *Price:* ₹${product.price.toLocaleString()}\n` +
        `${product.originalPrice ? `~~₹${product.originalPrice.toLocaleString()}~~ *${product.discount}% OFF*\n` : ''}` +
        `🎨 *Color:* ${product.color}\n` +
        `🧵 *Fabric:* ${product.fabric}\n` +
        `📂 *Collection:* ${product.collection}\n` +
        `📝 *Description:* ${product.description}\n\n` +
        `✅ *In Stock: ${product.inStock ? 'Available' : 'Out of Stock'}*\n\n` +
        `🛒 *I'm interested in this saree. Please share more details!*`;
      
      return NextResponse.json({ 
        success: true, 
        whatsappMessage,
        product 
      });
    }
    
    if (action === 'createOrder') {
      const product = productData.find((p: any) => p.id === productId);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      const orderMessage = `🛍️ *NEW ORDER - LEVE COTTONS* 🛍️\n\n` +
        `👤 *Customer Details:*\n` +
        `Name: ${customerInfo.name}\n` +
        `Phone: ${customerInfo.phone}\n` +
        `Address: ${customerInfo.address}\n\n` +
        `📦 *Order Details:*\n` +
        `Product Code: ${product.productCode}\n` +
        `Product: ${product.name}\n` +
        `Price: ₹${product.price.toLocaleString()}\n` +
        `Color: ${product.color}\n` +
        `Fabric: ${product.fabric}\n` +
        `Collection: ${product.collection}\n` +
        `Quantity: ${customerInfo.quantity || 1}\n\n` +
        `💳 *Total Amount: ₹${(product.price * (customerInfo.quantity || 1)).toLocaleString()}*\n\n` +
        `📅 *Order Date: ${new Date().toLocaleDateString('en-IN')}*\n` +
        `🕐 *Order Time: ${new Date().toLocaleTimeString('en-IN')}*`;
      
      return NextResponse.json({ 
        success: true, 
        orderMessage,
        orderId: `LC-${Date.now()}`,
        product 
      });
    }
    
    // Default product creation
    const product = await request.json();
    const client = await clientPromise;
    const db = client.db('levecotton');
    const newProduct = { ...product, id: Date.now().toString() };
    await db.collection('products').insertOne(newProduct);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...productUpdate } = await request.json();
    console.log('PUT request received:', { id, productUpdate });
    
    const client = await clientPromise;
    const db = client.db('levecotton');
    
    const result = await db.collection('products').updateOne(
      { id: id },
      { $set: productUpdate }
    );
    
    console.log('Database update result:', result);
    
    if (result.matchedCount > 0) {
      const updatedProduct = await db.collection('products').findOne({ id: id });
      console.log('Product updated:', updatedProduct);
      return NextResponse.json({ success: true, product: updatedProduct });
    } else {
      console.log('Product not found with id:', id);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const client = await clientPromise;
    const db = client.db('levecotton');
    
    const result = await db.collection('products').deleteOne({ id: id });
    
    if (result.deletedCount > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}