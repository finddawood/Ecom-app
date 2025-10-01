const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// -------------------------
// Multer storage config
// -------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // save in backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// -------------------------
// Page routes
// -------------------------
router.get('/', controller.listProducts);
router.get('/add', controller.showAddProduct);

// ✅ Image upload enabled
router.post('/add', upload.single('image'), controller.createProduct);

// -------------------------
// Search products
// -------------------------
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const products = await Product.find({
      name: { $regex: query, $options: 'i' }
    }).sort({ createdAt: -1 });
    res.render('products', { products, query });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching products');
  }
});

// -------------------------
// Checkout (cart)
// -------------------------
router.get('/checkout', async (req, res) => {
  let cartItems = [];
  let total = 0;

  if (req.query.cart) {
    try {
      const cartData = JSON.parse(req.query.cart);
      for (const item of cartData) {
        const product = await Product.findById(item.productId);
        if (product) {
          cartItems.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            qty: item.qty
          });
          total += product.price * item.qty;
        }
      }
    } catch (err) {
      console.error("❌ Cart parse error:", err);
    }
  }

  res.render('checkout', { cartItems, total });
});

// -------------------------
// API endpoints
// -------------------------
router.get('/api', controller.apiList);
router.get('/api/:id', controller.getProductAPI);
router.post('/api', controller.apiCreate);

module.exports = router;
