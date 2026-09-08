require('dotenv').config(); // MUST BE ON LINE 1
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { put } = require('@vercel/blob');

const app = express();
const PORT = process.env.PORT || 5000;

// Cross-origin resource sharing configurations 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving the static front-end assets directly from the workspace folder
app.use(express.static(path.join(__dirname)));

// Configure Cloudinary Integration layer if environmental credentials are present
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log("🚀 Cloudinary configuration loaded successfully.");
}

// MongoDB Instance Connectivity Tunnel Configuration
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error("CRITICAL ERROR: MONGODB_URI environment variable is completely missing!");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('Successfully connected to secure MongoDB database layer.'))
    .catch(err => {
        console.error('MongoDB database connection error:', err);
        process.exit(1);
    });

// Schema layout architecture definitions mapping marketplace entities
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 }, 
    category: { type: String, required: true }, 
    description: { type: String, required: true },
    images: { type: [String], required: true }, 
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Memory Allocation engine rules management for inbound payload structures
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per batch execution upload
});

// Primary Endpoint capturing seller payloads and proxying imagery to Storage Engine
app.post('/api/products', upload.array('images', 10), async (req, res) => {
    try {
        const { name, title, price, stock, quantity, category, description } = req.body;
        
        // Resolve field differences between front-end variations
        const finalName = name || title;
        const finalStock = stock || quantity || 0;

        if (!finalName || !price || !category || !description) {
            return res.status(400).json({ error: 'Validation failed: Missing mandatory product informational text properties.' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Inbound Multi-part asset field validation failed: Missing product files array.' });
        }

        const uploadedImageUrls = [];

        // STRATEGY 1: Cloudinary File Processing Engine (Highest Priority Match)
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
            console.log("☁️ Processing assets via Cloudinary storage pipe...");
            for (const file of req.files) {
                const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const uploadResult = await cloudinary.uploader.upload(fileBase64, {
                    folder: 'shopnova_products',
                });
                uploadedImageUrls.push(uploadResult.secure_url);
            }
        } 
        // STRATEGY 2: Vercel Blob File Processing Engine (Fallback Option)
        else if (process.env.BLOB_READ_WRITE_TOKEN) {
            console.log("☁️ Vercel Blob token detected. Syncing assets to cloud...");
            for (const file of req.files) {
                const blobFileName = `shopnova-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${path.extname(file.originalname)}`;
                const blob = await put(blobFileName, file.buffer, {
                    access: 'public',
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });
                uploadedImageUrls.push(blob.url);
            }
        } 
        // STRATEGY 3: Local Development Fail-safe
        else {
            console.log("⚠️ Missing cloud keys. Defaulting to fallback asset mapping arrays.");
            for (const file of req.files) {
                uploadedImageUrls.push(`/docs/images/${file.originalname}`);
            }
        }

        // Instantiating transactional database documents embedding asset links array
        const newProduct = new Product({
            name: finalName,
            price: Number(price),
            stock: Number(finalStock),
            category,
            description,
            images: uploadedImageUrls 
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product successfully deployed live to store display pipeline.', product: newProduct });
    } catch (error) {
        console.error('Product ingestion handler transaction exception error logs:', error);
        res.status(500).json({ error: 'Internal system fault failed to catalog submission properties.' });
    }
});

// Storefront retrieval endpoint querying active items catalog array
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error('Inventory collection resolution workflow fault:', error);
        res.status(500).json({ error: 'Failed to synchronize live application store contents lists.' });
    }
});

// Endpoint: Handle deleting a product from the database by its unique ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found in database catalog.' });
        }
        
        console.log(`🗑️ Product deleted successfully: ${deletedProduct.name}`);
        res.status(200).json({ message: 'Product successfully removed from database storage pipeline.' });
    } catch (error) {
        console.error('Inventory deletion transaction exception error logs:', error);
        res.status(500).json({ error: 'Internal system fault failed to execute deletion request.' });
    }
});

// Fallback path handler router pointing directly to frontend homepage template
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            res.status(404).send("ShopNova entrypoint interface assets missing.");
        }
    });
});

// Establishing port tracking configurations for continuous request ingestion channels
app.listen(PORT, () => {
    console.log(`====================================`);
    console.log(`       SHOPNOVA SERVER RUNNING`);
    console.log(`====================================`);
    console.log("Local cluster stream URL: http://localhost:" + PORT);
    console.log("Products API Engine link: http://localhost:" + PORT + "/api/products");
    console.log(`------------------------------------`);
    console.log(`SYSTEM STATE: ACTIVE & READY`);
    console.log(`------------------------------------`);
});
