const Product = require('../models/Product');
const { memoryProducts } = require('../utils/memoryStore');
const { dbStatus } = require('../config/db');

// -------------------------
// Landing page
// -------------------------
exports.getLanding = async (req, res) => {
  try {
    let products = [];
    if (dbStatus()) {
      // MongoDB: get latest 4 products
      products = await Product.find().sort({ createdAt: -1 }).limit(4);
    } else {
      // Memory fallback: get last 4
      products = memoryProducts.slice(-4).reverse();
    }
    res.render('index', { products });
  } catch (err) {
    console.error("Landing page error:", err);
    res.render('index', { products: [] });
  }
};

// -------------------------
// List all products
// -------------------------
exports.listProducts = async (req, res) => {
  const q = req.query.q || '';
  if (dbStatus()) {
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.render('products', { products, query: q });
  } else {
    let products = memoryProducts;
    if (q) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
      );
    }
    return res.render('products', { products, query: q });
  }
};

// -------------------------
// Show add product form
// -------------------------
exports.showAddProduct = (req, res) => {
  res.render('addProduct', { error: null });
};

// -------------------------
// Create product (with upload support)
// -------------------------
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    let imageUrl = '';

    // If file uploaded via Multer
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }
    // Or fallback to provided URL
    else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      imageUrl = '/public/images/placeholder.png';
    }

    if (dbStatus()) {
      const p = new Product({
        name,
        description,
        price: Number(price),
        imageUrl
      });
      await p.save();
    } else {
      memoryProducts.push({
        _id: Date.now().toString(),
        name,
        description,
        price: Number(price),
        imageUrl,
        createdAt: new Date()
      });
    }

    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.render('addProduct', { error: 'Failed to add product' });
  }
};

// -------------------------
// Get single product (API)
// -------------------------
exports.getProductAPI = async (req, res) => {
  if (dbStatus()) {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    return res.json(product);
  } else {
    const product = memoryProducts.find(p => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    return res.json(product);
  }
};

// -------------------------
// API list products
// -------------------------
exports.apiList = async (req, res) => {
  if (dbStatus()) {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } else {
    return res.json(memoryProducts);
  }
};

// -------------------------
// API create product
// -------------------------
exports.apiCreate = async (req, res) => {
  const data = req.body;
  if (dbStatus()) {
    const p = new Product(data);
    await p.save();
    return res.status(201).json(p);
  } else {
    const obj = {
      ...data,
      _id: Date.now().toString(),
      createdAt: new Date()
    };
    memoryProducts.push(obj);
    return res.status(201).json(obj);
  }
};
