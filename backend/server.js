require('dotenv').config();
const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();

// ✅ Setup EJS
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Public static (CSS, JS, placeholder images, etc.)
const staticPath = path.join(__dirname, '../frontend/public');
console.log("Serving static files from:", staticPath);
app.use('/public', express.static(staticPath));

// ✅ Serve uploaded images
const uploadsPath = path.join(__dirname, './uploads');
console.log("Serving uploads from:", uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Landing page
const { getLanding } = require('./controllers/productController');
app.get(['/', '/home'], getLanding);

// ✅ Connect to DB (with fallback to memory)
connectDB(process.env.MONGODB_URI);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
