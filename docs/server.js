const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { put } = require('@vercel/blob');

const app = express();
const PORT = process.env.PORT || 5000;

// cross origin resource sharing configurations 
app.use(cors());
app.use(express.json());

// Serving the static front-end assets directly from the docs workspace folder
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

// Schema layout architecture definitions mapping standard marketplace entities
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Memory Allocation engine rules management for inbound payload structures
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Primary Endpoint capturing seller payloads and proxying imagery to Vercel Blob
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Inbound Multi-part asset field validation failed: Missing product image file.' });
        }

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return res.status(500).json({ error: 'Backend deployment pipeline execution error: Missing Vercel Blob access key configuration.' });
        }

        // Generating a secure timestamped filename for cloud persistence
        const blobFileName = `shopnova-${Date.now()}${path.extname(req.file.originalname)}`;

        // Streaming binary asset directly to Vercel Blob Storage container
        const blob = await put(blobFileName, req.file.buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        // Instantiating transactional database documents embedding cloud asset link
        const newProduct = new Product({
            name,
            price,
            description,
            image: blob.url // This is the permanent public image URL
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

// Fallback rule routing index requests back home seamlessly if needed (Express v5 Compliant Splat)
app.get('/:splat*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Establishing port tracking configurations for continuous request ingestion channels
app.listen(PORT, () => {
    console.log(`Server execution sequence operational. Monitoring connections over port: ${PORT}`);
});
