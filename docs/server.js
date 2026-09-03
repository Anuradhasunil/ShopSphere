const express = require('express');
const cors = require('cors'); // Ensure npm install cors is complete
const multer = require('multer'); // Ensure npm install multer is complete
const app = express();

// 🔓 CROSS-ORIGIN PROTECTION CONFIGURATION
// Since your frontend sits on a Vercel url or files routing path, 
// the browser will throw a CORS crash block if this middleware isn't present!
app.use(cors({
    origin: '*', // Allows your frontend application layout to interact freely
    methods: ['GET', 'POST']
}));

// Standard JSON parsing engine structures
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup temporary memory storage vector tracking or disk engine configs
const upload = multer({ storage: multer.memoryStorage() });

// Variable placeholder monitoring array cache
let productCache = [];

// 📥 DATA CONSUMPTION ENDPOINT ROUTE
app.post('/upload', upload.array('images', 10), async function(req, res) {
    try {
        const { title, price, stock, category, description } = req.body;

        // Construct clean runtime structure instances 
        const newProductEntry = {
            id: Date.now(),
            title,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            description,
            // Track file metadata logs or buffer references
            images: req.files ? req.files.map(f => f.originalname) : [] 
        };

        // Commit transaction data securely to array architecture or standard cloud DB mappings
        productCache.push(newProductEntry);
        console.log("Success! Appended data entry log to dynamic records registry:", newProductEntry);

        return res.status(200).json({
            success: true,
            message: "Catalog updated successfully! Product received.",
            receivedData: newProductEntry
        });

    } catch (error) {
        console.error("Critical Upload Pipeline Exception Error: ", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal cloud server runtime error processing request configuration stack parameters." 
        });
    }
});

/* ==========================================================
   SERVER RUNTIME ENGINE PORT LISTENER 
============================================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("=========================================");
    console.log(`ShopNova Server online on port ${PORT}`);
    console.log("=========================================");
});