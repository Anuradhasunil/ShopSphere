const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { put } = require('@vercel/blob');

const app = express();
const PORT = process.env.PORT || 5000;

// Cross-origin resource sharing configurations 
app.use(cors());
app.use(express.json());

// Serving the static front-end assets directly from the workspace folder
app.use(express.static(path.join(__dirname)));

// MongoDB Cloud Instance Connectivity Tunnel Configuration
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error("CRITICAL ERROR: MONGODB_URI environment variable is completely missing!");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('Successfully connected to secure MongoDB Cloud layer.'))
    .catch(err => {
        console.error('MongoDB Atlas Cloud Connectivity database connection error:', err);
        process.exit(1);
    });

// Schema layout architecture definitions mapping marketplace entities
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 }, // Added to catch stock field from your UI
    category: { type: String, required: true }, // Added to catch category dropdown from your UI
    description: { type: String, required: true },
    images: { type: [String], required: true }, // Changed from String to an Array of Strings for multiple image URLs
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Memory Allocation engine rules management for inbound payload structures
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
});

// Primary Endpoint capturing seller payloads and proxying imagery to Vercel Blob
// Changed from upload.single('image') to upload.array('images', 6) to support up to 6 images
app.post('/api/products', upload.array('images', 6), async (req, res) => {
    try {
        const { name, title, price, stock, quantity, category, description } = req.body;
        
        // Defensive checking to resolve variance between 'name' and 'title' from frontend
        const finalName = name || title;
        // Defensive checking to resolve variance between 'stock' and 'quantity' from frontend
        const finalStock = stock || quantity || 0;

        if (!finalName || !price || !category || !description) {
            return res.status(400).json({ error: 'Validation failed: Missing mandatory product informational text properties.' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Inbound Multi-part asset field validation failed: Missing product files array.' });
        }

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return res.status(500).json({ error: 'Backend deployment pipeline execution error: Missing Vercel Blob access key configuration.' });
        }

        const uploadedImageUrls = [];

        // Loop through each file uploaded by Multer and stream it directly to Vercel Blob Storage
        for (const file of req.files) {
            const blobFileName = `shopnova-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${path.extname(file.originalname)}`;
            
            const blob = await put(blobFileName, file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN
            });
            
            uploadedImageUrls.push(blob.url);
        }

        // Instantiating transactional database documents embedding cloud asset links array
        const newProduct = new Product({
            name: finalName,
            price: Number(price),
            stock: Number(finalStock),
            category,
            description,
            images: uploadedImageUrls // This is the array of permanent public cloud images
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

// Establishing port tracking configurations for continuous request ingestion channels
app.listen(PORT, () => {
    console.log(`Server execution sequence operational. Monitoring connections over port: ${PORT}`);
});
