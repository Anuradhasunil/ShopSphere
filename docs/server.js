"use strict";


/* =====================================================
   SHOPNOVA SERVER
===================================================== */

const express = require("express");

const path = require("path");

const fs = require("fs");

const multer = require("multer");


const app = express();

const PORT =
    process.env.PORT || 5000;


/* =====================================================
   DIRECTORIES
===================================================== */

const ROOT_DIR =
    __dirname;


const UPLOAD_DIR =
    path.join(
        ROOT_DIR,
        "uploads",
        "products"
    );


/*
 * Make sure upload directory exists.
 */

fs.mkdirSync(
    UPLOAD_DIR,
    {
        recursive: true
    }
);


/* =====================================================
   EXPRESS SETUP
===================================================== */

app.use(
    express.json({
        limit: "15mb"
    })
);


app.use(
    express.urlencoded({
        extended: true,
        limit: "15mb"
    })
);


/*
 * Serve complete project.
 */

app.use(
    express.static(
        ROOT_DIR
    )
);


/*
 * Serve uploaded product images.
 */

app.use(
    "/uploads",
    express.static(
        path.join(
            ROOT_DIR,
            "uploads"
        )
    )
);


/* =====================================================
   MULTER STORAGE
===================================================== */

const storage =
    multer.diskStorage({

        destination:
            function(
                req,
                file,
                callback
            ) {

                callback(
                    null,
                    UPLOAD_DIR
                );

            },


        filename:
            function(
                req,
                file,
                callback
            ) {


                /*
                 * Create safe unique filename.
                 */

                const extension =
                    path.extname(
                        file.originalname
                    ).toLowerCase();


                const baseName =
                    path.basename(
                        file.originalname,
                        extension
                    )
                    .replace(
                        /[^a-zA-Z0-9_-]/g,
                        "-"
                    )
                    .replace(
                        /-+/g,
                        "-"
                    )
                    .slice(
                        0,
                        60
                    );


                const timestamp =
                    Date.now();


                const random =
                    Math.round(
                        Math.random() *
                        1000000
                    );


                const finalName =
                    baseName +
                    "-" +
                    timestamp +
                    "-" +
                    random +
                    extension;


                callback(
                    null,
                    finalName
                );

            }

    });


/* =====================================================
   IMAGE FILTER
===================================================== */

function imageFileFilter(
    req,
    file,
    callback
) {


    if (
        file.mimetype &&
        file.mimetype.startsWith(
            "image/"
        )
    ) {

        callback(
            null,
            true
        );

    }

    else {

        callback(
            new Error(
                "Only image files are allowed."
            )
        );

    }

}


/* =====================================================
   MULTER
===================================================== */

const upload =
    multer({

        storage:
            storage,

        fileFilter:
            imageFileFilter,

        limits: {

            files: 10,

            fileSize:
                10 * 1024 * 1024

        }

    });


/* =====================================================
   TEMPORARY GPS STORAGE
===================================================== */

const locations = {};


/* =====================================================
   PRODUCT STORAGE
===================================================== */

const PRODUCTS_FILE =
    path.join(
        ROOT_DIR,
        "products.json"
    );


/*
 * Read existing products.
 */

function readProducts() {

    try {

        if (
            !fs.existsSync(
                PRODUCTS_FILE
            )
        ) {

            return [];

        }


        const text =
            fs.readFileSync(
                PRODUCTS_FILE,
                "utf8"
            );


        if (!text.trim()) {

            return [];

        }


        const products =
            JSON.parse(text);


        return Array.isArray(products)
            ? products
            : [];

    }

    catch(error) {

        console.error(
            "PRODUCT FILE READ ERROR:",
            error
        );

        return [];

    }

}


/*
 * Save products.
 */

function saveProducts(
    products
) {

    fs.writeFileSync(

        PRODUCTS_FILE,

        JSON.stringify(
            products,
            null,
            4
        ),

        "utf8"

    );

}


/* =====================================================
   SAFETY POLICY
===================================================== */

const prohibitedPatterns = [


    /* Adult / sexual content */

    /\bsex\s*toy(s)?\b/i,

    /\badult\s*toy(s)?\b/i,

    /\bsex\s*product(s)?\b/i,

    /\bvibrator(s)?\b/i,

    /\bdildo(s)?\b/i,

    /\blingerie\b/i,

    /\bcondom(s)?\b/i,

    /\berotic\b/i,

    /\bporn\b/i,

    /\bpornography\b/i,

    /\bxxx\b/i,

    /\bnsfw\b/i,

    /\bexplicit\s*content\b/i,


    /* Alcohol */

    /\balcohol\b/i,

    /\bliquor\b/i,

    /\bwhiskey\b/i,

    /\bwhisky\b/i,

    /\bvodka\b/i,

    /\brum\b/i,

    /\bbrandy\b/i,

    /\bgin\b/i,

    /\btequila\b/i,

    /\bbeer\b/i,

    /\bwine\b/i,

    /\bchampagne\b/i,

    /\bcocktail\b/i,

    /\bspirits\b/i,


    /* Tobacco / nicotine */

    /\bcigarette(s)?\b/i,

    /\bcigar(s)?\b/i,

    /\btobacco\b/i,

    /\bvape(s)?\b/i,

    /\bvaping\b/i,

    /\be-?cigarette(s)?\b/i,

    /\be-?liquid\b/i,

    /\bnicotine\b/i,

    /\bhookah\b/i,

    /\bshisha\b/i,


    /* Recreational drugs */

    /\bcocaine\b/i,

    /\bheroin\b/i,

    /\bmethamphetamine\b/i,

    /\bmeth\b/i,

    /\bcrack cocaine\b/i,

    /\bketamine\b/i,

    /\blsd\b/i,

    /\bmdma\b/i,

    /\becstasy\b/i,

    /\bmushroom(s)?\b/i,

    /\bmagic mushrooms\b/i,

    /\bmarijuana\b/i,

    /\bcannabis\b/i,

    /\bweed\b/i,

    /\bhashish\b/i,

    /\bhash\b/i,

    /\bthc\b/i,


    /* Drug paraphernalia */

    /\bdrug\s*pipe\b/i,

    /\bbong(s)?\b/i,

    /\bdrug\s*kit\b/i,

    /\bdrug\s*paraphernalia\b/i

];


/* =====================================================
   SAFETY CHECK
===================================================== */

function checkProductSafety(
    product
) {


    const searchableText = [

        product.name || "",

        product.category || "",

        product.description || "",

        product.imageName || "",

        ...(product.imageNames || [])

    ].join(" ");


    for (
        const pattern
        of prohibitedPatterns
    ) {


        if (
            pattern.test(
                searchableText
            )
        ) {

            return {

                safe:
                    false,

                reason:
                    "This product appears to contain prohibited adult, alcohol, tobacco/nicotine, drug-related, or otherwise restricted content."

            };

        }

    }


    return {

        safe:
            true,

        reason:
            ""

    };

}


/* =====================================================
   SELLER PRODUCT SUBMISSION
===================================================== */

app.post(

    "/api/seller-products",

    upload.array(
        "gallery",
        10
    ),

    function(
        req,
        res
    ) {


        try {


            const body =
                req.body || {};


            const files =
                req.files || [];


            /* -----------------------------------------
               REQUIRED IMAGE
            ----------------------------------------- */

            if (
                files.length === 0
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Please select at least one product image."

                });

            }


            /* -----------------------------------------
               REQUIRED FIELDS
            ----------------------------------------- */

            if (
                !body.name ||
                !body.name.trim()
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Product name is required."

                });

            }


            if (
                body.price === undefined ||
                body.price === ""
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Product price is required."

                });

            }


            const price =
                Number(
                    body.price
                );


            if (
                !Number.isFinite(price) ||
                price < 0
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Invalid product price."

                });

            }


            if (
                !body.category
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Product category is required."

                });

            }


            if (
                !body.description ||
                !body.description.trim()
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Product description is required."

                });

            }


            /* -----------------------------------------
               GPS
            ----------------------------------------- */

            const latitude =
                Number(
                    body.latitude
                );


            const longitude =
                Number(
                    body.longitude
                );


            if (
                !Number.isFinite(
                    latitude
                ) ||
                !Number.isFinite(
                    longitude
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Valid seller GPS coordinates are required."

                });

            }


            /* -----------------------------------------
               BUILD IMAGE DATA
            ----------------------------------------- */

            const imagePaths =
                files.map(
                    function(file) {

                        return (
                            "/uploads/products/" +
                            file.filename
                        );

                    }
                );


            const imageNames =
                files.map(
                    function(file) {

                        return file.originalname;

                    }
                );


            /* -----------------------------------------
               PRODUCT OBJECT FOR SAFETY
            ----------------------------------------- */

            const productForSafety = {

                name:
                    body.name.trim(),

                category:
                    body.category,

                description:
                    body.description.trim(),

                imageName:
                    imageNames.join(" "),

                imageNames:
                    imageNames

            };


            /* -----------------------------------------
               SAFETY CHECK
            ----------------------------------------- */

            const safety =
                checkProductSafety(
                    productForSafety
                );


            if (
                !safety.safe
            ) {


                /*
                 * Delete uploaded files when rejected.
                 */

                files.forEach(
                    function(file) {

                        try {

                            fs.unlinkSync(
                                file.path
                            );

                        }

                        catch(deleteError) {

                            console.error(
                                "FILE DELETE ERROR:",
                                deleteError
                            );

                        }

                    }
                );


                console.log(
                    "🚫 PRODUCT REJECTED:",
                    body.name
                );


                return res.status(400).json({

                    success:
                        false,

                    approved:
                        false,

                    message:
                        "This product cannot be published on ShopNova because it violates our family-friendly marketplace policy."

                });

            }


            /* -----------------------------------------
               CREATE PRODUCT
            ----------------------------------------- */

            const products =
                readProducts();


            const product = {

                id:
                    "product-" +
                    Date.now(),

                name:
                    body.name.trim(),

                price:
                    price,

                category:
                    body.category,

                description:
                    body.description.trim(),

                image:
                    imagePaths[0],

                images:
                    imagePaths,

                imageNames:
                    imageNames,

                latitude:
                    latitude,

                longitude:
                    longitude,

                sellerType:
                    "seller",

                createdAt:
                    new Date().toISOString()

            };


            products.push(
                product
            );


            saveProducts(
                products
            );


            /* -----------------------------------------
               SAVE GPS
            ----------------------------------------- */

            locations.seller = {

                latitude:
                    latitude,

                longitude:
                    longitude,

                updatedAt:
                    new Date().toISOString()

            };


            /* -----------------------------------------
               SERVER LOG
            ----------------------------------------- */

            console.log(
                "===================================="
            );


            console.log(
                "✅ PRODUCT APPROVED:"
            );


            console.log(
                "Name:",
                product.name
            );


            console.log(
                "Price:",
                product.price
            );


            console.log(
                "Category:",
                product.category
            );


            console.log(
                "Images:",
                product.images.length
            );


            console.log(
                "GPS:",
                latitude,
                longitude
            );


            console.log(
                "===================================="
            );


            /* -----------------------------------------
               RESPONSE
            ----------------------------------------- */

            return res.json({

                success:
                    true,

                approved:
                    true,

                message:
                    "Product passed ShopNova's basic safety check and was saved successfully.",

                product:
                    product

            });

        }


        catch(error) {


            console.error(
                "PRODUCT SUBMISSION ERROR:",
                error
            );


            /*
             * Clean up uploaded files if something
             * failed after upload.
             */

            if (
                req.files &&
                req.files.length
            ) {

                req.files.forEach(
                    function(file) {

                        try {

                            if (
                                fs.existsSync(
                                    file.path
                                )
                            ) {

                                fs.unlinkSync(
                                    file.path
                                );

                            }

                        }

                        catch(deleteError) {

                            console.error(
                                "CLEANUP ERROR:",
                                deleteError
                            );

                        }

                    }
                );

            }


            return res.status(500).json({

                success:
                    false,

                message:
                    "Unable to submit the product. Please try again."

            });

        }

    }

);


/* =====================================================
   MULTER / UPLOAD ERROR HANDLER
===================================================== */

app.use(
    function(
        error,
        req,
        res,
        next
    ) {


        if (
            error instanceof
            multer.MulterError
        ) {


            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Each image must be 10 MB or smaller."

                });

            }


            if (
                error.code ===
                "LIMIT_FILE_COUNT"
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "You can upload a maximum of 10 images."

                });

            }


            return res.status(400).json({

                success:
                    false,

                message:
                    error.message

            });

        }


        if (
            error
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    error.message ||
                    "File upload error."

            });

        }


        next();

    }
);


/* =====================================================
   HOME PAGE
===================================================== */

app.get(
    "/",
    function(
        req,
        res
    ) {


        const possibleFiles = [

            path.join(
                ROOT_DIR,
                "index.html"
            ),

            path.join(
                ROOT_DIR,
                "docs",
                "index.html"
            )

        ];


        const found =
            possibleFiles.find(
                function(file) {

                    return fs.existsSync(
                        file
                    );

                }
            );


        if (!found) {

            return res.status(404).send(
                "ShopNova index.html not found."
            );

        }


        res.sendFile(
            found
        );

    }
);


/* =====================================================
   PRODUCTS JSON API
===================================================== */

app.get(
    "/api/products",
    function(
        req,
        res
    ) {


        const products =
            readProducts();


        res.json(
            products
        );

    }
);


/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

app.get(
    "/api/products/:id",
    function(
        req,
        res
    ) {


        const products =
            readProducts();


        const product =
            products.find(
                function(item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        req.params.id
                    );

                }
            );


        if (!product) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Product not found."

            });

        }


        res.json({

            success:
                true,

            product:
                product

        });

    }
);


/* =====================================================
   GPS SAVE
===================================================== */

app.post(
    "/api/location",
    function(
        req,
        res
    ) {


        try {


            const {
                userType,
                latitude,
                longitude
            } =
                req.body;


            const allowedTypes = [

                "buyer",

                "seller",

                "delivery"

            ];


            if (
                !allowedTypes.includes(
                    userType
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Invalid user type"

                });

            }


            const lat =
                Number(
                    latitude
                );


            const lng =
                Number(
                    longitude
                );


            if (
                !Number.isFinite(
                    lat
                ) ||
                !Number.isFinite(
                    lng
                )
            ) {

                return res.status(400).json({

                    success:
                        false,

                    message:
                        "Invalid GPS coordinates"

                });

            }


            locations[userType] = {

                latitude:
                    lat,

                longitude:
                    lng,

                updatedAt:
                    new Date().toISOString()

            };


            console.log(
                `📍 ${userType.toUpperCase()} LOCATION UPDATED:`,
                lat,
                lng
            );


            res.json({

                success:
                    true,

                message:
                    `${userType} location saved successfully`,

                location:
                    locations[userType]

            });

        }


        catch(error) {


            console.error(
                "GPS SAVE ERROR:",
                error
            );


            res.status(500).json({

                success:
                    false,

                message:
                    "Unable to save location"

            });

        }

    }
);


/* =====================================================
   GET ONE LOCATION
===================================================== */

app.get(
    "/api/location/:userType",
    function(
        req,
        res
    ) {


        const userType =
            req.params.userType;


        const allowedTypes = [

            "buyer",

            "seller",

            "delivery"

        ];


        if (
            !allowedTypes.includes(
                userType
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Invalid user type"

            });

        }


        const location =
            locations[userType];


        if (!location) {

            return res.json({

                success:
                    true,

                available:
                    false,

                message:
                    `No location available for ${userType}`

            });

        }


        res.json({

            success:
                true,

            available:
                true,

            userType:
                userType,

            location:
                location

        });

    }
);


/* =====================================================
   GET ALL LOCATIONS
===================================================== */

app.get(
    "/api/locations",
    function(
        req,
        res
    ) {


        res.json({

            success:
                true,

            locations:
                locations

        });

    }
);


/* =====================================================
   GPS HEALTH
===================================================== */

app.get(
    "/api/gps-status",
    function(
        req,
        res
    ) {


        res.json({

            success:
                true,

            gpsSystem:
                "ShopNova GPS System",

            status:
                "online",

            trackedUsers:
                Object.keys(
                    locations
                ).length,

            users:
                Object.keys(
                    locations
                )

        });

    }
);


/* =====================================================
   404
===================================================== */

app.use(
    function(
        req,
        res
    ) {

        res.status(404).json({

            success:
                false,

            message:
                "ShopNova route not found."

        });

    }
);


/* =====================================================
   START SERVER
===================================================== */

app.listen(

    PORT,

    function() {


        console.log("");

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
            "------------------------------------"
        );

        console.log(
            "PRODUCT UPLOAD: READY"
        );

        console.log(
            "PRODUCT SAFETY FILTER: READY"
        );

        console.log(
            "GPS SYSTEM: READY"
        );

        console.log(
            "Buyer GPS: READY"
        );

        console.log(
            "Seller GPS: READY"
        );

        console.log(
            "Delivery GPS: READY"
        );

        console.log(
            "------------------------------------"
        );

        console.log(
            "Maximum images: 10"
        );

        console.log(
            "Maximum image size: 10 MB"
        );

        console.log(
            "------------------------------------"
        );

        console.log(
            "===================================="
        );

        console.log("");

    }

);