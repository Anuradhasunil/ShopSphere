"use strict";

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================================
   SHOPNOVA SERVER SETUP
========================================= */

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


/* Serve all ShopNova files */

app.use(
    express.static(__dirname)
);


/* =========================================
   TEMPORARY GPS / LOCATION STORAGE
========================================= */

const locations = {};


/* =========================================
   SHOPNOVA PRODUCT SAFETY POLICY
=========================================

   Products containing prohibited categories
   are rejected before server approval.

   This is a basic text/file-name filter.
   It does NOT replace professional image
   moderation.
========================================= */

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


/* =========================================
   SAFETY CHECK
========================================= */

function checkProductSafety(product) {

    const searchableText = [

        product.name || "",

        product.category || "",

        product.description || "",

        product.imageName || ""

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

                safe: false,

                reason:
                    "This product appears to contain prohibited adult, alcohol, tobacco/nicotine, drug-related, or otherwise restricted content."

            };

        }

    }


    return {

        safe: true,

        reason: ""

    };

}


/* =========================================
   SELLER PRODUCT SUBMISSION
========================================= */

app.post(
    "/api/seller-products",
    (req, res) => {

        try {

            const product =
                req.body;


            if (!product) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No product data received."

                });

            }


            /* Basic required fields */

            if (
                !product.name ||
                !product.image
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product name and image are required."

                });

            }


            /* Check image format */

            if (
                product.imageType &&
                !product.imageType.startsWith(
                    "image/"
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Only image files are allowed."

                });

            }


            /* =================================
               SAFETY CHECK
            ================================= */

            const safety =
                checkProductSafety(
                    product
                );


            if (!safety.safe) {

                console.log(
                    "🚫 PRODUCT REJECTED:",
                    product.name
                );


                return res.status(400).json({

                    success: false,

                    approved: false,

                    message:
                        "This product cannot be published on ShopNova because it violates our family-friendly marketplace policy."

                });

            }


            /*
             * Product passed the basic safety
             * filter.
             *
             * For now we return it to the
             * seller page, which stores it
             * locally.
             */

            console.log(
                "✅ PRODUCT APPROVED:",
                product.name
            );


            return res.json({

                success: true,

                approved: true,

                message:
                    "Product passed ShopNova's basic safety check.",

                product: product

            });


        } catch (error) {

            console.error(
                "PRODUCT SAFETY ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to check the product. Please try again."

            });

        }

    }
);


/* =========================================
   HOME PAGE
========================================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    }
);


/* =========================================
   PRODUCTS JSON
========================================= */

app.get(
    "/api/products",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "products.json"
            )
        );

    }
);


/* =========================================
   GPS - SAVE LOCATION
========================================= */

app.post(
    "/api/location",
    (req, res) => {

        try {

            const {
                userType,
                latitude,
                longitude
            } = req.body;


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

                    success: false,

                    message:
                        "Invalid user type"

                });

            }


            if (
                typeof latitude !==
                    "number" ||

                typeof longitude !==
                    "number"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid GPS coordinates"

                });

            }


            locations[userType] = {

                latitude:
                    latitude,

                longitude:
                    longitude,

                updatedAt:
                    new Date().toISOString()

            };


            console.log(
                `📍 ${userType.toUpperCase()} LOCATION UPDATED:`,
                latitude,
                longitude
            );


            res.json({

                success: true,

                message:
                    `${userType} location saved successfully`,

                location:
                    locations[userType]

            });


        } catch (error) {

            console.error(
                "GPS SAVE ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to save location"

            });

        }

    }
);


/* =========================================
   GPS - GET ONE USER LOCATION
========================================= */

app.get(
    "/api/location/:userType",
    (req, res) => {

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

                success: false,

                message:
                    "Invalid user type"

            });

        }


        const location =
            locations[userType];


        if (!location) {

            return res.json({

                success: true,

                available: false,

                message:
                    `No location available for ${userType}`

            });

        }


        res.json({

            success: true,

            available: true,

            userType:
                userType,

            location:
                location

        });

    }
);


/* =========================================
   GPS - GET ALL LOCATIONS
========================================= */

app.get(
    "/api/locations",
    (req, res) => {

        res.json({

            success: true,

            locations:
                locations

        });

    }
);


/* =========================================
   GPS HEALTH CHECK
========================================= */

app.get(
    "/api/gps-status",
    (req, res) => {

        res.json({

            success: true,

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


/* =========================================
   START SERVER
========================================= */

app.listen(
    PORT,
    () => {

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
            "===================================="
        );

        console.log("");

    }
);