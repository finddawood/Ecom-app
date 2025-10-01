const Order = require('../models/Order');
const Product = require('../models/Product');
const { memoryOrders, memoryProducts } = require('../utils/memoryStore');
const { dbStatus } = require('../config/db');

// List orders page
exports.listOrdersPage = async (req, res) => {
  if (dbStatus()) {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.render('orderHistory', { orders });
  } else {
    return res.render('orderHistory', { orders: memoryOrders });
  }
};

// Create order (dummy + real DB)
exports.createOrder = async (req, res) => {
  /*
    Expected body:
    {
      items: [{ productId, qty }],
      payer: { name, email },
      paymentId: 'PAYPAL_ORDER_ID or DUMMY_xxx',
      total: 123.45
    }
  */
  try {
    const { items, payer, paymentId, total } = req.body;

    if (dbStatus()) {
      // ✅ Real MongoDB mode
      const populatedItems = [];
      for (const it of items) {
        const product = await Product.findById(it.productId);
        if (product) {
          populatedItems.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            qty: it.qty || 1
          });
        }
      }
      const order = new Order({
        items: populatedItems,
        total,
        payer,
        paymentId,
        status: 'COMPLETED'
      });
      await order.save();
      return res.status(201).json({ success: true, order });
    } else {
      // ✅ In-memory fallback
      const populatedItems = items.map(it => {
        const prod = memoryProducts.find(p => p._id === it.productId);
        return {
          productId: prod?._id || it.productId,
          name: prod?.name || "Unknown Product",
          price: prod?.price || 0,
          qty: it.qty || 1
        };
      });

      const order = {
        _id: Date.now().toString(),
        items: populatedItems,
        total,
        payer,
        paymentId,
        status: 'COMPLETED',
        createdAt: new Date()
      };
      memoryOrders.push(order);
      return res.status(201).json({ success: true, order });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};

// API list orders
exports.apiListOrders = async (req, res) => {
  if (dbStatus()) {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } else {
    return res.json(memoryOrders);
  }
};
