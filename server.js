const express = require("express");
const cors = require("cors");
const multer = require("multer");

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
   MULTER
========================================================= */

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
    },

    fileFilter: function(req, file, callback) {

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
   ADD PRODUCT
========================================================= */

app.post(
    "/add-product",
    upload.array("images", 10),

    async (req, res) => {

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


            const files =
                req.files || [];


            /* =================================================
               VALIDATION
            ================================================= */

            if (
                !title ||
                !price ||
                stock === undefined ||
                !category ||
                !latitude ||
                !longitude
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Missing required product information."

                });

            }


            if (files.length === 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please upload at least one product image."

                });

            }


            if (files.length > 10) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Maximum 10 images are allowed."

                });

            }


            /* =================================================
               SERVER LOG
            ================================================= */

            console.log(
                "===================================="
            );

            console.log(
                "SHOPNOVA PRODUCT SUBMISSION"
            );

            console.log(
                "===================================="
            );

            console.log(
                "Product:",
                title
            );

            console.log(
                "Price:",
                price
            );

            console.log(
                "Stock:",
                stock
            );

            console.log(
                "Category:",
                category
            );

            console.log(
                "Description:",
                description
            );

            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );

            console.log(
                "Images received:",
                files.length
            );


            files.forEach(
                (file, index) => {

                    console.log(
                        `Image ${index + 1}:`,
                        file.originalname,
                        "|",
                        file.mimetype,
                        "|",
                        file.size,
                        "bytes"
                    );

                }
            );


            /*
               IMPORTANT:

               The files are currently stored in RAM only.

               They are NOT permanently saved yet.

               Later we can connect this to:
               - MongoDB
               - Cloudinary
               - Vercel Blob
               - another cloud storage service
            */


            /* =================================================
               SUCCESS RESPONSE
            ================================================= */

            return res.status(200).json({

                success: true,

                message:
                    "Catalog updated successfully! Product received.",

                receivedData: {

                    title: title,

                    price: price,

                    stock: stock,

                    category: category,

                    description: description,

                    location: {

                        latitude: latitude,

                        longitude: longitude

                    },

                    imageCount: files.length

                }

            });


        } catch (serverError) {

            console.error(
                "Product processing error:",
                serverError
            );


            return res.status(500).json({

                success: false,

                message:
                    serverError.message ||
                    "Internal Server Exception Error."

            });

        }

    }
);


/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

app.use(
    function(error, req, res, next) {

        if (
            error instanceof multer.MulterError
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Upload error: " +
                    error.message

            });

        }


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }


        next();

    }
);


/* =========================================================
   LOCAL SERVER
========================================================= */

if (
    process.env.NODE_ENV !== "production"
) {

    const PORT =
        process.env.PORT || 5000;

    app.listen(
        PORT,
        () => {

            console.log(
                "===================================="
            );

            console.log(
                "       SHOPNOVA SERVER RUNNING"
            );

            console.log(
                "===================================="
            );

            console.log(
                `Local: http://localhost:${PORT}`
            );

            console.log(
                `Seller: http://localhost:${PORT}/seller.html`
            );

            console.log(
                `Products API: http://localhost:${PORT}/api/products`
            );

            console.log(
                "------------------------------------"
            );

            console.log(
                "IMAGE UPLOAD: READY"
            );

            console.log(
                "PRODUCT API: READY"
            );

            console.log(
                "GPS SYSTEM: READY"
            );

        }
    );

}


/* =========================================================
   VERCEL EXPORT
========================================================= */

module.exports = app;