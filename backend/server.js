const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

// Check if running locally before trying to load dotenv package
if (process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config();
    } catch (e) {
        console.log("⚠️ Dotenv module skipped in non-local cluster execution.");
    }
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Database Connection String Matching Guards
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.mongoURI;

if (!mongoURI) {
    console.error("❌ Critical Error: Database connection string (MONGO_URI/MONGODB_URI) is missing!");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log("🏁 Connected to MongoDB Database successfully."))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Product Schema Definition
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // Array storing Cloudinary Image URLs
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Configure Multer for Memory Storage
const storage = multer.memoryStorage();
const upload = multer.array('productImages', 10); // Matches 'productImages' name in form array

// API Route: Add a Product with Images
app.post('/api/products', upload, async (req, res) => {
    try {
        const { title, price, stock, category, description } = req.body;
        const imageUrls = [];

        // Check if files are uploaded
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Convert buffer to data URI string for base64 uploading
                const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
                    folder: 'shopnova_products'
                });
                imageUrls.push(uploadResponse.secure_url);
            }
        }

        const newProduct = new Product({
            title,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            description,
            images: imageUrls
        });

        await newProduct.save();
        res.status(201).json({ success: true, message: "Product created successfully!", product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API Route: Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
