"use strict";

const CART_KEY = "shopnova_cart";

/* =====================================================
   SHOPNOVA PRODUCTS
===================================================== */

const SHOPNOVA_PRODUCTS = [
    {
        id: "bible-wonders",
        name: "Bible Wonders",
        price: 499,
        image: "images/bible-wonders.jpg"
    },
    {
        id: "womens-shoes",
        name: "Women's Shoes",
        price: 1499,
        image: "images/womens-shoes.jpg"
    },
    {
        id: "mens-suit",
        name: "Men's Suit",
        price: 2999,
        image: "images/suit.jpg"
    },
    {
        id: "tuxedo",
        name: "Tuxedo",
        price: 3499,
        image: "images/tuxedo.jpg"
    },
    {
        id: "loungewear",
        name: "Premium Loungewear",
        price: 1299,
        image: "images/loungewear.jpg"
    },
    {
        id: "sunglasses",
        name: "Premium Sunglasses",
        price: 999,
        image: "images/sunglasses.jpg"
    },
    {
        id: "bag",
        name: "Premium Bag",
        price: 1799,
        image: "images/bag.jpg"
    },
    {
        id: "earbuds",
        name: "Wireless Earbuds",
        price: 1999,
        image: "images/earbuds.jpg"
    },
    {
        id: "makeup",
        name: "Premium Makeup",
        price: 899,
        image: "images/makeup.jpg"
    },
    {
        id: "perfume",
        name: "Premium Perfume",
        price: 1499,
        image: "images/perfume.jpg"
    },
    {
        id: "supercar-key",
        name: "Supercar Key",
        price: 4999,
        image: "images/supercar-key.jpg"
    },
    {
        id: "watch",
        name: "Premium Watch",
        price: 2999,
        image: "images/watch.jpg"
    }
];


/* =====================================================
   GET CART
===================================================== */

function getCart() {
    try {
        const saved = localStorage.getItem(CART_KEY);

        if (!saved) {
            return [];
        }

        const cart = JSON.parse(saved);

        return Array.isArray(cart) ? cart : [];

    } catch (error) {
        console.error("Cart error:", error);
        return [];
    }
}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* =====================================================
   FIND PRODUCT
===================================================== */

function findProduct(productId) {

    return SHOPNOVA_PRODUCTS.find(
        product =>
            String(product.id) === String(productId)
    );
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productId) {

    let product = null;

    if (
        typeof productId === "object" &&
        productId !== null
    ) {

        product = {
            id:
                productId.id ||
                productId.productId ||
                productId.name,

            name:
                productId.name ||
                "ShopNova Product",

            price:
                Number(productId.price) || 0,

            image:
                productId.image ||
                productId.img ||
                ""
        };

    } else {

        product = findProduct(productId);

    }


    if (!product && typeof productId === "string") {

        product =
            SHOPNOVA_PRODUCTS.find(
                item =>
                    item.name.toLowerCase() ===
                    productId.toLowerCase()
            );
    }


    if (!product) {

        showShopNovaMessage(
            "Product could not be added."
        );

        console.error(
            "Product not found:",
            productId
        );

        return;
    }


    const cart = getCart();


    const existingIndex =
        cart.findIndex(
            item =>
                String(item.id) ===
                String(product.id)
        );


    if (existingIndex !== -1) {

        cart[existingIndex].quantity =
            (Number(
                cart[existingIndex].quantity
            ) || 1) + 1;

        /*
         * IMPORTANT:
         * Always repair the image if an old
         * incorrect image was stored.
         */
        cart[existingIndex].image =
            product.image;

        cart[existingIndex].name =
            product.name;

        cart[existingIndex].price =
            Number(product.price) || 0;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price:
                Number(product.price) || 0,

            image:
                product.image,

            quantity: 1
        });
    }


    saveCart(cart);


    showShopNovaMessage(
        product.name +
        " added to cart."
    );
}


/* =====================================================
   DIRECT PRODUCT BUTTON
===================================================== */

function addProductToCart(
    id,
    name,
    price,
    image
) {

    const cart = getCart();

    const productId =
        String(id || name);

    const existingIndex =
        cart.findIndex(
            item =>
                String(item.id) ===
                productId
        );


    if (existingIndex !== -1) {

        cart[existingIndex].quantity =
            (Number(
                cart[existingIndex].quantity
            ) || 1) + 1;

        cart[existingIndex].image =
            image;

        cart[existingIndex].name =
            name;

        cart[existingIndex].price =
            Number(price) || 0;

    } else {

        cart.push({

            id: productId,

            name:
                name || "ShopNova Product",

            price:
                Number(price) || 0,

            image:
                image || "images/luxury-banner.jpg",

            quantity: 1
        });
    }


    saveCart(cart);


    showShopNovaMessage(
        name + " added to cart."
    );
}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const cart = getCart();

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (Number(item.quantity) || 0),
            0
        );


    document
        .querySelectorAll("#cartCount")
        .forEach(
            element => {
                element.textContent = total;
            }
        );
}


/* =====================================================
   HOME SEARCH
===================================================== */

function setupHomeSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const button =
        document.getElementById(
            "searchButton"
        );


    if (!input) {
        return;
    }


    function goToProducts() {

        const text =
            input.value.trim();


        if (text === "") {

            window.location.href =
                "products.html";

            return;
        }


        window.location.href =
            "products.html?search=" +
            encodeURIComponent(text);
    }


    if (button) {

        button.addEventListener(
            "click",
            goToProducts
        );
    }


    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                goToProducts();
            }
        }
    );
}


/* =====================================================
   CONTACT
===================================================== */

function openContact() {

    const popup =
        document.getElementById(
            "contactPopup"
        );

    if (popup) {

        popup.classList.add("show");

        document.body.style.overflow =
            "hidden";
    }
}


function closeContact() {

    const popup =
        document.getElementById(
            "contactPopup"
        );

    if (popup) {

        popup.classList.remove("show");

        document.body.style.overflow =
            "";
    }
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   MESSAGE
===================================================== */

function showShopNovaMessage(message) {

    let box =
        document.getElementById(
            "shopnovaMessage"
        );


    if (!box) {

        box =
            document.createElement("div");

        box.id =
            "shopnovaMessage";

        box.style.position =
            "fixed";

        box.style.right =
            "20px";

        box.style.bottom =
            "20px";

        box.style.zIndex =
            "999999";

        box.style.background =
            "linear-gradient(135deg,#1767d8,#0875b9)";

        box.style.color =
            "#fff";

        box.style.padding =
            "13px 18px";

        box.style.borderRadius =
            "12px";

        box.style.fontSize =
            "13px";

        box.style.fontWeight =
            "800";

        box.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.25)";

        box.style.transition =
            "opacity .3s ease";

        document.body.appendChild(box);
    }


    box.textContent =
        "✓ " + message;

    box.style.opacity =
        "1";


    clearTimeout(
        window.shopnovaMessageTimer
    );


    window.shopnovaMessageTimer =
        setTimeout(
            function() {

                box.style.opacity =
                    "0";

            },
            1800
        );
}


/* =====================================================
   STORAGE SYNC
===================================================== */

window.addEventListener(
    "storage",
    function(event) {

        if (event.key === CART_KEY) {
            updateCartCount();
        }
    }
);


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        setupHomeSearch();

    }
);