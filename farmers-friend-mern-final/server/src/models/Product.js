import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  type: { type: String, enum: ['fertilizer','seed','pesticide','tool','organic','other'], default: 'other' },
  subType: { type: String },
  brand: { type: String },
  npk: {
    n: { type: Number, default: 0 },
    p: { type: Number, default: 0 },
    k: { type: Number, default: 0 }
  },
  composition: String,
  isOrganic: { type: Boolean, default: false },
  cropSuitability: [String],
  unit: { type: String, enum: ['kg','g','litre','ml','packet','bag'], default: 'kg' },
  weightOrVolume: { type: Number, default: 1 },
  sku: { type: String, unique: true, sparse: true },
  mrp: { type: Number },
  price: { type: Number, required: true },
  gstPercent: { type: Number, default: 0 },
  stockQty: { type: Number, default: 0 },
  images: [String],
  rating: {
    avg: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

ProductSchema.index({ title: "text", description: "text" });
ProductSchema.index({ categoryId: 1, price: 1 });

export default mongoose.model('Product', ProductSchema);
