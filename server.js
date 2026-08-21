"use strict";

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve ShopNova website files
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Products API
app.get("/api/products", (req, res) => {
    res.sendFile(path.join(__dirname, "products.json"));
});

// Start server
app.listen(PORT, () => {
    console.log("");
    console.log("====================================");
    console.log("       SHOPNOVA SERVER RUNNING");
    console.log("====================================");
    console.log("Local: http://localhost:" + PORT);
    console.log("====================================");
    console.log("");
});