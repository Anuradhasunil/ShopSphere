const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connects directly to Vercel's securely saved environment key string
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopnova')
  .then(() => console.log('Connected to Cloud MongoDB Atlas successfully!'))
  .catch(err => console.error('MongoDB layout connection error:', err));

// Complete Vendor and Shop Product Schema Structure
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  stock: Number,
  sellerName: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  sellerPhone: { type: String, required: true } 
});

const Product = mongoose.model('Product', productSchema);

// 1. POST ROUTE: Receive user listed items and submit to Mongo Atlas Cloud Cluster
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product saved live!', product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET ROUTE: Load all stored vendor inventories onto the storefront homepage grid
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET Live Search Route filtering elements matching query strings
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);
  
  try {
    const results = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ShopNova API operational on port ${PORT}`));
