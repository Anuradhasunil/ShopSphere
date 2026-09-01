"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 5000;


/* =====================================================
   BODY PARSERS
   Larger limit because seller products contain
   multiple image Data URLs.
===================================================== */

app.use(
    express.json({
        limit: "50mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "50mb"
    })
);


/* =====================================================
   SERVE SHOPNOVA WEBSITE FILES
===================================================== */

app.use(
    express.static(__dirname)
);


/* =====================================================
   HOME PAGE
===================================================== */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


/* =====================================================
   PRODUCTS API
===================================================== */

app.get("/api/products", (req, res) => {

    const productsFile =
        path.join(__dirname, "products.json");

    if (!fs.existsSync(productsFile)) {

        return res.json([]);

    }

    try {

        const products =
            JSON.parse(
                fs.readFileSync(
                    productsFile,
                    "utf8"
                )
            );

        res.json(products);

    } catch (error) {

        console.error(
            "PRODUCTS JSON ERROR:",
            error
        );

        res.status(500).json([]);

    }

});


/* =====================================================
   SELLER PRODUCTS
===================================================== */

app.post(
    "/api/seller-products",
    (req, res) => {

        try {

            const product =
                req.body;


            /* -----------------------------------------
               BASIC VALIDATION
            ----------------------------------------- */

            if (!product) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No product data received."

                });

            }


            if (
                !product.name ||
                String(product.name).trim() === ""
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a product name."

                });

            }


            if (
                product.price === undefined ||
                product.price === null ||
                Number(product.price) <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid product price."

                });

            }


            /* -----------------------------------------
               IMAGE VALIDATION
            ----------------------------------------- */

            if (
                !Array.isArray(product.images) ||
                product.images.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please select at least one product image."

                });

            }


            /* -----------------------------------------
               CREATE PRODUCTS FILE IF NEEDED
            ----------------------------------------- */

            const productsFile =
                path.join(
                    __dirname,
                    "products.json"
                );


            let products = [];


            if (
                fs.existsSync(
                    productsFile
                )
            ) {

                try {

                    const existing =
                        fs.readFileSync(
                            productsFile,
                            "utf8"
                        );

                    products =
                        existing.trim()
                            ? JSON.parse(existing)
                            : [];

                    if (
                        !Array.isArray(products)
                    ) {

                        products = [];

                    }

                } catch (error) {

                    console.error(
                        "Could not read products.json:",
                        error
                    );

                    products = [];

                }

            }


            /* -----------------------------------------
               CREATE PRODUCT ID
            ----------------------------------------- */

            const newProduct = {

                ...product,

                id:
                    product.id ||
                    (
                        "shopnova-" +
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 8)
                    ),

                name:
                    String(product.name).trim(),

                price:
                    Number(product.price),

                createdAt:
                    product.createdAt ||
                    new Date().toISOString()

            };


            /* -----------------------------------------
               SAVE PRODUCT
            ----------------------------------------- */

            products.push(
                newProduct
            );


            fs.writeFileSync(

                productsFile,

                JSON.stringify(
                    products,
                    null,
                    4
                ),

                "utf8"

            );


            /* -----------------------------------------
               SUCCESS RESPONSE
            ----------------------------------------- */

            return res.status(200).json({

                success: true,

                message:
                    "Product approved and added successfully.",

                product:
                    newProduct

            });


        } catch (error) {

            console.error(
                "SELLER PRODUCT ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to save the product. Please try again."

            });

        }

    }
);


/* =====================================================
   START SERVER
===================================================== */

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
            "Local: http://localhost:" +
            PORT
        );

        console.log(
            "===================================="
        );

        console.log("");

    }
);