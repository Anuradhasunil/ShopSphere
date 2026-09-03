const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { put } = require("@vercel/blob");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

/* =========================================================
   MULTER (Memory Buffer Engine)
========================================================= */

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
        files: 10
    },
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype &&
            file.mimetype.startsWith("image/")
        ) {
            callback(null, true);
        } else {
            callback(
                new Error(
                    "Only image files are allowed."
                )
            );
        }
    }
});

/* =========================================================
   HEALTH CHECKS
========================================================= */

app.get(
    "/",
    function (req, res) {
        res.status(200).json({
            success: true,
            message: "ShopNova API is running successfully."
        });
    }
);

app.get(
    "/api",
    function (req, res) {
        res.status(200).json({
            success: true,
            message: "ShopNova API is ready."
        });
    }
);

/* =========================================================
   ADD PRODUCT (WITH VERCEL BLOB INTELLIGENCE)
========================================================= */

app.post(
    "/add-product",
    upload.array("images", 10),
    async function (req, res) {
        try {
            const {
                title,
                price,
                stock,
                category,
                description,
                latitude,
                longitude
            } = req.body;

            const files = req.files || [];

            /* =================================================
               VALIDATION
            ================================================= */

            if (
                !title ||
                !String(title).trim() ||
                price === undefined ||
                price === null ||
                price === "" ||
                stock === undefined ||
                stock === null ||
                stock === "" ||
                !category ||
                !String(category).trim() ||
                !latitude ||
                !longitude
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required product information."
                });
            }

            /* =================================================
               NUMBER VALIDATION
            ================================================= */

            const numericPrice = Number(price);
            const numericStock = Number(stock);
            const numericLatitude = Number(latitude);
            const numericLongitude = Number(longitude);

            if (
                !Number.isFinite(numericPrice) ||
                numericPrice < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid product price."
                });
            }

            if (
                !Number.isInteger(numericStock) ||
                numericStock < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid stock quantity."
                });
            }

            if (
                !Number.isFinite(numericLatitude) ||
                !Number.isFinite(numericLongitude)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide valid GPS coordinates."
                });
            }

            /* =================================================
               IMAGE VALIDATION
            ================================================= */

            if (files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload at least one product image."
                });
            }

            if (files.length > 10) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum 10 images are allowed."
                });
            }

            /* =================================================
               SERVER INFRASTRUCTURE LOGS
            ================================================= */

            console.log("====================================");
            console.log("SHOPNOVA PRODUCT SUBMISSION");
            console.log("====================================");
            console.log("Product:", String(title).trim());
            console.log("Price:", numericPrice);
            console.log("Stock:", numericStock);
            console.log("Category:", String(category).trim());
            console.log("Description:", description ? String(description).trim() : "");
            console.log("Latitude:", numericLatitude);
            console.log("Longitude:", numericLongitude);
            console.log("Images received:", files.length);

            files.forEach(function (file, index) {
                console.log(
                    `Image ${index + 1}:`,
                    file.originalname,
                    "|",
                    file.mimetype,
                    "|",
                    file.size,
                    "bytes"
                );
            });

            /* =================================================
               STREAM ASSETS TO VERCEL BLOB STORAGE CABINET
            ================================================= */
            const uploadedImageUrls = [];

            for (const file of files) {
                // Generate secure timestamped path naming keys
                const uniqueFilename = `products/${Date.now()}-${file.originalname}`;
                
                const blob = await put(uniqueFilename, file.buffer, {
                    access: 'public',
                    contentType: file.mimetype,
                    token: process.env.BLOB_READ_WRITE_TOKEN
                });

                uploadedImageUrls.push(blob.url);
            }

            console.log("Cloud Assets successfully mapped:", uploadedImageUrls);

            /* =================================================
               SUCCESS RESPONSE
            ================================================= */

            return res.status(200).json({
                success: true,
                message: "Catalog updated successfully! Product received.",
                receivedData: {
                    title: String(title).trim(),
                    price: numericPrice,
                    stock: numericStock,
                    category: String(category).trim(),
                    description: description ? String(description).trim() : "",
                    latitude: numericLatitude,
                    longitude: numericLongitude,
                    images: uploadedImageUrls // URLs delivered cleanly back to the client!
                }
            });

        } catch (error) {
            console.error("Critical Runtime Fault Exception:", error);
            return res.status(500).json({
                success: false,
                message: "An internal server error occurred while uploading assets."
            });
        }
    }
);

/* =========================================================
   PORT RUNTIME MONITOR
========================================================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log(`ShopNova Express core system launched on port ${PORT}`);
});
