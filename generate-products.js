const fs = require('fs');
const path = require('path');

const colors = ['Red', 'Blue', 'Green', 'Pink', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Maroon', 'Teal', 'Gold'];
const fabrics = ['Cotton', 'Silk', 'Georgette', 'Rayon', 'Chiffon', 'Crepe'];
const categories = ['new-arrivals', 'best-sellers', 'collections', 'sale'];

const sareeNames = [
  'Elegant Silk Saree', 'Traditional Cotton Saree', 'Designer Party Wear', 'Classic Handloom Saree',
  'Premium Georgette Saree', 'Vintage Style Saree', 'Modern Fusion Saree', 'Bridal Collection Saree',
  'Festive Wear Saree', 'Casual Cotton Saree', 'Embroidered Silk Saree', 'Printed Designer Saree',
  'Royal Collection Saree', 'Heritage Series Saree', 'Contemporary Style Saree', 'Artisan Craft Saree',
  'Luxury Silk Saree', 'Ethnic Wear Saree', 'Bollywood Style Saree', 'Indo-Western Saree',
  'Handwoven Cotton Saree', 'Zari Work Saree', 'Mirror Work Saree', 'Block Print Saree'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePrice(category) {
  switch(category) {
    case 'sale': return Math.floor(Math.random() * 4000) + 2000;
    case 'new-arrivals': return Math.floor(Math.random() * 8000) + 4000;
    case 'best-sellers': return Math.floor(Math.random() * 12000) + 6000;
    case 'collections': return Math.floor(Math.random() * 20000) + 10000;
    default: return 5000;
  }
}

const products = [];

for (let i = 1; i <= 97; i++) {
  const category = categories[(i - 1) % 4];
  const imageExt = i <= 81 ? 'jpg' : (i <= 86 ? 'jpeg' : 'jpg');
  
  products.push({
    id: `prod_${i}`,
    name: `${getRandomElement(sareeNames)} ${i}`,
    price: generatePrice(category),
    image: `/products/${i}.${imageExt}`,
    description: `Beautiful ${getRandomElement(fabrics).toLowerCase()} saree with intricate design and premium quality finish`,
    category: category,
    color: getRandomElement(colors),
    fabric: getRandomElement(fabrics),
    inStock: true
  });
}

const filePath = path.join(__dirname, 'lib', 'products.json');
fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
console.log(`Generated ${products.length} products and saved to products.json`);