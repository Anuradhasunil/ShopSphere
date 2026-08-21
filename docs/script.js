"use strict";

const CART_KEY = "shopnova_cart";

/* =====================================================
   CART STORAGE
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


function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const cart = getCart();

    let count = 0;

    cart.forEach(function(item) {
        count += Number(item.quantity) || 1;
    });

    document.querySelectorAll("#cartCount").forEach(function(el) {
        el.textContent = count;
    });
}


/* =====================================================
   ADD TO CART
===================================================== */

function addProductToCart(id, name, price, image) {

    const cart = getCart();

    const productId = String(id);

    const existing = cart.find(function(item) {
        return String(item.id) === productId;
    });

    if (existing) {

        existing.quantity =
            (Number(existing.quantity) || 1) + 1;

    } else {

        cart.push({
            id: productId,
            name: String(name),
            price: Number(price) || 0,
            image: String(image || ""),
            quantity: 1
        });
    }

    saveCart(cart);

    showMessage(
        name + " added to cart!"
    );
}


/* =====================================================
   ALSO SUPPORT addToCart()
===================================================== */

function addToCart(product) {

    if (!product) {
        return;
    }

    addProductToCart(
        product.id || product.name,
        product.name || product.title || "Product",
        product.price || 0,
        product.image || ""
    );
}


/* =====================================================
   REMOVE PRODUCT
===================================================== */

function removeFromCart(id) {

    let cart = getCart();

    cart = cart.filter(function(item) {
        return String(item.id) !== String(id);
    });

    saveCart(cart);

    if (typeof renderCart === "function") {
        renderCart();
    }
}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeCartQuantity(id, amount) {

    const cart = getCart();

    const item = cart.find(function(product) {
        return String(product.id) === String(id);
    });

    if (!item) {
        return;
    }

    item.quantity =
        (Number(item.quantity) || 1) + amount;

    if (item.quantity <= 0) {

        const index = cart.indexOf(item);

        if (index !== -1) {
            cart.splice(index, 1);
        }
    }

    saveCart(cart);

    if (typeof renderCart === "function") {
        renderCart();
    }
}


/* =====================================================
   CLEAR CART
===================================================== */

function clearCart() {

    const cart = getCart();

    if (cart.length === 0) {
        showMessage("Cart is already empty.");
        return;
    }

    if (!confirm("Remove all products from your cart?")) {
        return;
    }

    localStorage.removeItem(CART_KEY);

    updateCartCount();

    if (typeof renderCart === "function") {
        renderCart();
    }

    showMessage("Cart cleared.");
}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    const input =
        document.getElementById("searchInput");

    const button =
        document.getElementById("searchButton") ||
        document.getElementById("searchBtn");

    if (!input) {
        return;
    }

    function searchProducts() {

        const text = input.value.trim();

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
            searchProducts
        );
    }

    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchProducts();
            }
        }
    );
}


/* =====================================================
   CONTACT
===================================================== */

function openContact() {

    const popup =
        document.getElementById("contactPopup");

    if (popup) {
        popup.classList.add("show");
    }
}


function closeContact() {

    const popup =
        document.getElementById("contactPopup");

    if (popup) {
        popup.classList.remove("show");
    }
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(message) {

    let box =
        document.getElementById(
            "shopnovaMessage"
        );

    if (!box) {

        box =
            document.createElement("div");

        box.id =
            "shopnovaMessage";

        box.style.position = "fixed";
        box.style.right = "20px";
        box.style.bottom = "20px";
        box.style.zIndex = "999999";

        box.style.background =
            "linear-gradient(135deg,#1767d8,#0875b9)";

        box.style.color = "#fff";

        box.style.padding =
            "14px 20px";

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

    box.textContent = "✓ " + message;

    box.style.opacity = "1";

    clearTimeout(
        window.shopnovaMessageTimer
    );

    window.shopnovaMessageTimer =
        setTimeout(function() {

            box.style.opacity = "0";

        }, 1800);
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
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        setupSearch();
    }
);