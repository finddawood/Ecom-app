const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 }
});

const OrderSchema = new mongoose.Schema({
  items: [OrderItemSchema],
  total: Number,
  payer: {
    name: String,
    email: String
  },
  paymentId: String,
  status: { type: String, default: 'CREATED' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
