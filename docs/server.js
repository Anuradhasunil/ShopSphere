const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { put } = require('@vercel/blob');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares & Static File Configurations
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files (HTML, CSS, Client JS) directly from the current folder
app.use(express.static(path.join(__dirname)));

// 2. MongoDB Atlas Schema & Model Setup
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true } // Stores the permanent cloud link string
});

const Product = mongoose.model('Product', productSchema);

// 3. Connect to your live MongoDB Atlas Cluster Database
// (Make sure you set MONGODB_URI inside your Render environment settings panel)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopnova';
mongoose.connect(mongoURI)
    .then(() => console.log('Successfully connected to MongoDB Atlas Cloud Database'))
    .catch(err => console.error('MongoDB connection failure:', err));

// 4. Multer Configuration (Uses RAM memory buffer storage instead of local disk storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 5. API ROUTES FOR SELLER & BUYER PLUGINS

// Route for buyers to get all product items dynamically
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve inventory data' });
    }
});

// Route for sellers to upload new products to the storefront safely
app.post('/api/products/add', upload.single('productImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a product image file' });
        }

        // Upload the temporary file buffer into Vercel Blob permanent repository 
        const blob = await put(`products/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN // Pulls secret securely from cloud dashboard environment configuration variables
        });

        const permanentImageUrl = blob.url;

        // Construct product profile matching mongoose schema specifications
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: permanentImageUrl
        });

        await newProduct.save();
        res.status(201).json({ success: true, message: 'Product successfully listed!' });

    } catch (error) {
        console.error("Upload process error encountered:", error);
        res.status(500).json({ error: 'Failed to process seller asset data package upload execution workflow' });
    }
});

// Fallback rule routing index requests back home seamlessly if needed
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 6. Active Cluster Port Execution Initialization
app.listen(PORT, () => {
    console.log(`Server executing live channel streams tracking accurately via port: ${PORT}`);
});
