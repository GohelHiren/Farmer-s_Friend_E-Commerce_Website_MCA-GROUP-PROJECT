// server/src/models/Order.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], default: [] },
    amount: { type: Number, required: true },
    address: {
      label: String,
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    status: {
      type: String,
      enum: ['payment_pending', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentInfo: {
      provider: { type: String, enum: ['razorpay', 'cod'], default: null },
      razorpay: {
        orderId: String,     // razorpay_order_id
        paymentId: String,   // razorpay_payment_id
        signature: String
      }
    }
  },
  { timestamps: true }
);

// ✅ put indexes after schema is defined
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ 'items.productId': 1, createdAt: -1 });

export default mongoose.model('Order', OrderSchema);
