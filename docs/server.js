"use strict";

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================
   SHOPNOVA SERVER SETUP
========================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve all ShopNova files */
app.use(express.static(__dirname));

/* =========================================
   TEMPORARY GPS / LOCATION STORAGE

   This is an in-memory system for now.
   Later we can connect MongoDB for permanent
   seller / buyer / delivery-boy tracking.
========================================= */

const locations = {};

/*
Example:

locations = {
    buyer: {
        latitude: 16.3067,
        longitude: 80.4365,
        updatedAt: "..."
    },

    seller: {
        latitude: 16.3000,
        longitude: 80.4300,
        updatedAt: "..."
    },

    delivery: {
        latitude: 16.3040,
        longitude: 80.4350,
        updatedAt: "..."
    }
};
*/


/* =========================================
   HOME PAGE
========================================= */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


/* =========================================
   PRODUCTS JSON
========================================= */

app.get("/api/products", (req, res) => {
    res.sendFile(path.join(__dirname, "products.json"));
});


/* =========================================
   GPS - SAVE LOCATION
========================================= */

app.post("/api/location", (req, res) => {

    try {

        const {
            userType,
            latitude,
            longitude
        } = req.body;

        /* Check user type */
        const allowedTypes = [
            "buyer",
            "seller",
            "delivery"
        ];

        if (!allowedTypes.includes(userType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user type"
            });
        }

        /* Check coordinates */
        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid GPS coordinates"
            });
        }

        /* Save location */
        locations[userType] = {
            latitude: latitude,
            longitude: longitude,
            updatedAt: new Date().toISOString()
        };

        console.log(
            `📍 ${userType.toUpperCase()} LOCATION UPDATED:`,
            latitude,
            longitude
        );

        res.json({
            success: true,
            message: `${userType} location saved successfully`,
            location: locations[userType]
        });

    } catch (error) {

        console.error("GPS SAVE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to save location"
        });
    }
});


/* =========================================
   GPS - GET ONE USER LOCATION
========================================= */

app.get("/api/location/:userType", (req, res) => {

    const userType = req.params.userType;

    const allowedTypes = [
        "buyer",
        "seller",
        "delivery"
    ];

    if (!allowedTypes.includes(userType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user type"
        });
    }

    const location = locations[userType];

    if (!location) {
        return res.json({
            success: true,
            available: false,
            message: `No location available for ${userType}`
        });
    }

    res.json({
        success: true,
        available: true,
        userType: userType,
        location: location
    });
});


/* =========================================
   GPS - GET ALL LOCATIONS
========================================= */

app.get("/api/locations", (req, res) => {

    res.json({
        success: true,
        locations: locations
    });

});


/* =========================================
   GPS HEALTH CHECK
========================================= */

app.get("/api/gps-status", (req, res) => {

    res.json({
        success: true,
        gpsSystem: "ShopNova GPS System",
        status: "online",
        trackedUsers: Object.keys(locations).length,
        users: Object.keys(locations)
    });

});


/* =========================================
   START SERVER
========================================= */

app.listen(PORT, () => {

    console.log("");

    console.log("====================================");
    console.log("       SHOPNOVA SERVER RUNNING");
    console.log("====================================");

    console.log(`Local: http://localhost:${PORT}`);

    console.log("------------------------------------");
    console.log("GPS SYSTEM: READY");
    console.log("Buyer GPS: READY");
    console.log("Seller GPS: READY");
    console.log("Delivery GPS: READY");
    console.log("------------------------------------");

    console.log("====================================");

    console.log("");
});