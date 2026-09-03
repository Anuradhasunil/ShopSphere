const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { put } = require("@vercel/blob");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
    fileFilter: function (req, file, callback) {
        if (file.mimetype && file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            callback(new Error("Only image files are allowed."));
        }
    }
});

app.post("/add-product", upload.array("images", 10), async function (req, res) {
    try {
        const { title, price, stock, category, description, latitude, longitude } = req.body;
        const files = req.files || [];

        if (!title || !price || !stock || !category || !latitude || !longitude) {
            return res.status(400).json({ success: false, message: "Missing required product information." });
        }

        const uploadedImageUrls = [];
        for (const file of files) {
            const uniqueFilename = `products/${Date.now()}-${file.originalname}`;
            const blob = await put(uniqueFilename, file.buffer, {
                access: 'public',
                contentType: file.mimetype,
                token: process.env.BLOB_READ_WRITE_TOKEN
            });
            uploadedImageUrls.push(blob.url);
        }

        return res.status(200).json({
            success: true,
            message: "Catalog updated successfully!",
            receivedData: { title, price, stock, category, description, latitude, longitude, images: uploadedImageUrls }
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ success: false, message: "Internal server fault." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express engine running on port ${PORT}`));
