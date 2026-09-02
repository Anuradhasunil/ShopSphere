const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Standard API Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure memory-backed processing storage for multiple uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // Maximum 10MB upload parameter constraint
});

// Primary Endpoint handler matching form keys exactly
app.post('/add-product', upload.array('images'), (req, res) => {
    try {
        const { title, price, category, description, latitude, longitude } = req.body;
        const files = req.files;

        // Perform foundational validation check blocks
        if (!title || !price || !category || !latitude || !longitude) {
            return res.status(400).send("Bad Request: Missing operational form text keys.");
        }

        if (!files || files.length === 0) {
            return res.status(400).send("Bad Request: Staging context missing media asset arrays.");
        }

        console.log(`Processing submission item: ${title} under category ${category}`);
        console.log(`Fulfillment location vector parameters: [${latitude}, ${longitude}]`);
        console.log(`Total active parsed asset documents: ${files.length}`);

        // --- ENTER DATABASE PERSISTENCE OR BLOB STORAGE HANDLERS HERE ---

        // Deliver clean, valid stringified JSON back to prevent parsing breaks on client side
        return res.status(200).json({
            success: true,
            message: "Catalog updated successfully! System routing payload saved.",
            receivedData: { title, price, category, location: { latitude, longitude } }
        });

    } catch (serverError) {
        console.error("Internal processing channel exception:", serverError);
        return res.status(500).send("Internal Server Exception Error.");
    }
});

// Handle standard local debugging listening triggers securely
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Local development runtime operational at http://localhost:${PORT}`);
    });
}

// CRITICAL EXPORT: Crucial block allowing Vercel's system engine to initialize standard serverless operations
module.exports = app;
