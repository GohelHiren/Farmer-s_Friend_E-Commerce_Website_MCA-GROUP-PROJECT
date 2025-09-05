// UPDATED seed.js — maps products to local static images
import { config } from 'dotenv';
config();
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI missing in .env');
  process.exit(1);
}

const img = (name) => `http://localhost:${process.env.PORT || 5000}/static/products/${name}`;

const categories = [
  { name: 'Fertilizers', slug: 'fertilizers' },
  { name: 'Seeds', slug: 'seeds' },
  { name: 'Pesticides', slug: 'pesticides' },
  { name: 'Organic', slug: 'organic' },
];

const products = [
  // Fertilizers
  { title: 'Urea 46% Nitrogen (50 kg bag)', description: 'Nitrogen-rich fertilizer for cereals and leafy crops.', type: 'fertilizer', brand: 'IFFCO', price: 620, mrp: 650, unit:'bag', weightOrVolume:50, gstPercent:5, stockQty: 120, images: ["http://localhost:5000/static/products/urea.jpg"], categorySlug:'fertilizers' },
  { title: 'DAP 18:46:0 (50 kg bag)', description: 'Phosphorus-heavy fertilizer for root development.', type: 'fertilizer', brand: 'GSFC', price: 1450, mrp: 1500, unit:'bag', weightOrVolume:50, gstPercent:5, stockQty: 100, images: ["http://localhost:5000/static/products/dap.jpg"], categorySlug:'fertilizers' },
  { title: 'NPK 19:19:19 Water Soluble (1 kg)', description: 'Balanced fertilizer for foliar spray & drip irrigation.', type: 'fertilizer', brand: 'Mahadhan', price: 95, mrp: 110, unit:'kg', weightOrVolume:1, gstPercent:5, stockQty: 80, images: ["http://localhost:5000/static/products/npk.jpg"], categorySlug:'fertilizers' },
  { title: 'Ammonium Sulphate (50 kg bag)', description: 'Sulphur-containing nitrogen fertilizer.', type: 'fertilizer', brand: 'GSFC', price: 750, mrp: 800, unit:'bag', weightOrVolume:50, gstPercent:5, stockQty: 70, images: ["http://localhost:5000/static/products/ammonium_sulphate.jpg"], categorySlug:'fertilizers' },
  { title: 'Single Super Phosphate (SSP) 50 kg', description: 'Source of phosphorus & sulphur.', type: 'fertilizer', brand: 'Coromandel', price: 680, mrp: 720, unit:'bag', weightOrVolume:50, gstPercent:5, stockQty: 90, images: ["http://localhost:5000/static/products/ssp.jpeg"], categorySlug:'fertilizers' },
  { title: 'Zinc Sulphate 33% (1 kg)', description: 'Micronutrient to correct zinc deficiency.', type: 'fertilizer', brand: 'Coromandel', price: 120, mrp: 140, unit:'kg', weightOrVolume:1, gstPercent:12, stockQty: 60, images: ["http://localhost:5000/static/products/zinc_sulphate.jpeg"], categorySlug:'fertilizers' },
  { title: 'Neem Cake Organic Manure (5 kg)', description: 'Organic soil conditioner & pest deterrent.', type: 'organic', brand: 'Local', price: 190, mrp: 220, unit:'kg', weightOrVolume:5, gstPercent:0, stockQty: 50, images:[img('neem_cake.jpg')], categorySlug:'organic' },

  // Seeds
  { title: 'Hybrid Cotton Seed (Bt)', description: 'High-yield Bt cotton hybrid.', type: 'seed', brand: 'Rasi', price: 820, mrp: 860, unit:'packet', weightOrVolume:1, gstPercent:0, stockQty: 40, images:[img('cotton_seed.webp')], categorySlug:'seeds' },
  { title: 'Groundnut Seed (Gujarat-9)', description: 'Popular groundnut variety for Gujarat.', type: 'seed', brand: 'Junagadh Seeds', price: 650, mrp: 700, unit:'kg', weightOrVolume:5, gstPercent:0, stockQty: 50, images:[img('groundnut_seed.jpg')], categorySlug:'seeds' },
  { title: 'Pearl Millet (Bajra) Hybrid Seed', description: 'Drought-tolerant hybrid bajra.', type: 'seed', brand: 'Shaktiman', price: 240, mrp: 260, unit:'kg', weightOrVolume:1, gstPercent:0, stockQty: 70, images:[img('bajra_seed.jpg')], categorySlug:'seeds' },
  { title: 'Wheat Seed (GW-366)', description: 'High-yield Gujarat wheat variety.', type: 'seed', brand: 'Gujarat Seeds', price: 1180, mrp: 1250, unit:'kg', weightOrVolume:40, gstPercent:0, stockQty: 65, images:[img('wheat_seed.jpg')], categorySlug:'seeds' },
  { title: 'Cumin (Jeera) Seed GC-4', description: 'High-germination cumin seed.', type: 'seed', brand: 'Gujarat Seeds Corp', price: 420, mrp: 450, unit:'kg', weightOrVolume:1, gstPercent:0, stockQty: 60, images:[img('cumin_seed.webp')], categorySlug:'seeds' },
  { title: 'Castor Seed (GCH-7)', description: 'Popular castor hybrid.', type: 'seed', brand: 'Gujarat Seeds', price: 360, mrp: 390, unit:'kg', weightOrVolume:2, gstPercent:0, stockQty: 55, images:[img('castor_seed.jpeg')], categorySlug:'seeds' },
  { title: 'Sesame (Til) Seed', description: 'Quality sesame seed for Kharif season.', type: 'seed', brand: 'Local', price: 230, mrp: 250, unit:'kg', weightOrVolume:1, gstPercent:0, stockQty: 70, images:[img('sesame_seed.webp')], categorySlug:'seeds' },

  // Pesticides / Fungicides
  { title: 'Imidacloprid 17.8% SL (100 ml)', description: 'Systemic insecticide for sucking pests.', type: 'pesticide', brand: 'Bayer', price: 210, mrp: 240, unit:'ml', weightOrVolume:100, gstPercent:18, stockQty: 90, images:[img('imidacloprid.jpg')], categorySlug:'pesticides' },
  { title: 'Monocrotophos 36% SL (500 ml)', description: 'Broad-spectrum insecticide.', type: 'pesticide', brand: 'Indofil', price: 320, mrp: 350, unit:'ml', weightOrVolume:500, gstPercent:18, stockQty: 80, images:[img('monocrotophos.jpeg')], categorySlug:'pesticides' },
  { title: 'Chlorpyrifos 20% EC (1 litre)', description: 'Insecticide for soil & foliar pests.', type: 'pesticide', brand: 'Excel', price: 520, mrp: 560, unit:'litre', weightOrVolume:1, gstPercent:18, stockQty: 70, images:[img('chlorpyrifos.jpg')], categorySlug:'pesticides' },
  { title: 'Mancozeb 75% WP (1 kg)', description: 'Broad-spectrum fungicide.', type: 'pesticide', brand: 'UPL', price: 280, mrp: 320, unit:'kg', weightOrVolume:1, gstPercent:12, stockQty: 60, images:[img('mancozeb.jpg')], categorySlug:'pesticides' },
  { title: 'Carbendazim 50% WP (500 g)', description: 'Systemic fungicide for cumin & wheat.', type: 'pesticide', brand: 'Rallis', price: 180, mrp: 210, unit:'g', weightOrVolume:500, gstPercent:12, stockQty: 65, images:[img('carbendazim.jpeg')], categorySlug:'pesticides' },
];

const adminUser = { name: 'Admin', email: 'admin@farmersfriend.com', password: 'admin123', role: 'admin' };

async function run() {
  await mongoose.connect(uri);
  console.log('Connected:', uri);

  await Promise.all([
    Category.deleteMany({}), Product.deleteMany({}), User.deleteMany({}), Order.deleteMany({})
  ]);

  const catDocs = await Category.insertMany(categories);
  const catMap = Object.fromEntries(catDocs.map(c => [c.slug, c._id]));
  const withCat = products.map(p => ({ ...p, categoryId: catMap[p.categorySlug] }));

  await Product.insertMany(withCat);
  await User.create(adminUser);
  await User.create({ name: 'Demo User', email: 'demo@user.com', password: 'demo123', role: 'user' });

  console.log('Seed data inserted.');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
