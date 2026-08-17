/* =====================================================
   SHOPNOVA MAIN JAVASCRIPT
   ===================================================== */


/* ================= CART STORAGE ================= */

const CART_KEY = "shopnova_cart";


/* ================= GET CART ================= */

function getCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(CART_KEY)
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error("Cart read error:", error);

        return [];

    }

}


/* ================= SAVE CART ================= */

function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* ================= UPDATE CART COUNT ================= */

function updateCartCount() {

    const cart = getCart();

    const total = cart.reduce(
        (sum, item) =>
            sum + Number(item.quantity || 1),
        0
    );

    document
        .querySelectorAll(".cart-count")
        .forEach(element => {

            element.textContent = total;

        });

}


/* ================= ADD TO CART ================= */

function addToCart(name, price, image) {

    let cart = getCart();

    const existing =
        cart.find(
            item => item.name === name
        );

    if (existing) {

        existing.quantity =
            Number(existing.quantity || 1) + 1;

    } else {

        cart.push({

            name: name,

            price: Number(price),

            image: image,

            quantity: 1

        });

    }

    saveCart(cart);

    updateCartCount();

    showAddedMessage(name);

}


/* ================= SUCCESS MESSAGE ================= */

function showAddedMessage(name) {

    const old =
        document.querySelector(".cart-message");

    if (old) {
        old.remove();
    }

    const message =
        document.createElement("div");

    message.className = "cart-message";

    message.textContent =
        name + " added to cart!";

    message.style.position = "fixed";
    message.style.right = "20px";
    message.style.bottom = "20px";
    message.style.zIndex = "9999";
    message.style.padding = "14px 20px";
    message.style.background = "#078b79";
    message.style.color = "#ffffff";
    message.style.borderRadius = "10px";
    message.style.fontWeight = "700";
    message.style.boxShadow =
        "0 8px 25px rgba(0,0,0,.2)";

    document.body.appendChild(message);

    setTimeout(() => {

        message.remove();

    }, 2200);

}


/* ================= REMOVE FROM CART ================= */

function removeFromCart(name) {

    let cart = getCart();

    cart =
        cart.filter(
            item => item.name !== name
        );

    saveCart(cart);

    updateCartCount();

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(name, amount) {

    const cart = getCart();

    const item =
        cart.find(
            product => product.name === name
        );

    if (!item) {
        return;
    }

    item.quantity =
        Number(item.quantity || 1) + amount;

    if (item.quantity <= 0) {

        removeFromCart(name);

        return;

    }

    saveCart(cart);

    updateCartCount();

}


/* ================= SEARCH ================= */

function searchProducts() {

    const input =
        document.getElementById("headerSearch");

    if (!input) {
        return;
    }

    const search =
        input.value.trim();

    if (!search) {

        window.location.href =
            "products.html";

        return;

    }

    window.location.href =
        "products.html?search=" +
        encodeURIComponent(search);

}


/* ================= PRODUCT FILTER ================= */

function filterProducts() {

    const input =
        document.getElementById("productSearch");

    const grid =
        document.getElementById("productsGrid");

    if (!input || !grid) {
        return;
    }

    const search =
        input.value
            .trim()
            .toLowerCase();

    const cards =
        grid.querySelectorAll(
            ".product-card"
        );

    let visible = 0;

    cards.forEach(card => {

        const text =
            card.textContent.toLowerCase();

        if (
            search === "" ||
            text.includes(search)
        ) {

            card.style.display = "";

            visible++;

        } else {

            card.style.display = "none";

        }

    });


    let noResults =
        grid.querySelector(
            ".no-results"
        );

    if (visible === 0) {

        if (!noResults) {

            noResults =
                document.createElement("div");

            noResults.className =
                "no-results";

            noResults.textContent =
                "No products found.";

            noResults.style.gridColumn =
                "1 / -1";

            noResults.style.textAlign =
                "center";

            noResults.style.padding =
                "60px";

            noResults.style.color =
                "#607d8b";

            grid.appendChild(noResults);

        }

    } else {

        if (noResults) {
            noResults.remove();
        }

    }

}


/* ================= URL SEARCH ================= */

function applyURLSearch() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const search =
        params.get("search");

    const input =
        document.getElementById(
            "productSearch"
        );

    if (
        search &&
        input
    ) {

        input.value = search;

        filterProducts();

    }

}


/* ================= CONTACT ================= */

function openContact() {

    const popup =
        document.getElementById(
            "contactPopup"
        );

    if (popup) {

        popup.classList.add("show");

    }

}


function closeContact() {

    const popup =
        document.getElementById(
            "contactPopup"
        );

    if (popup) {

        popup.classList.remove("show");

    }

}


/* ================= CLOSE CONTACT OUTSIDE ================= */

document.addEventListener(
    "click",
    function(event) {

        const popup =
            document.getElementById(
                "contactPopup"
            );

        if (!popup) {
            return;
        }

        if (
            event.target === popup
        ) {

            closeContact();

        }

    }
);


/* ================= SEARCH ENTER KEY ================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            document.activeElement &&
            document.activeElement.id ===
                "headerSearch"
        ) {

            searchProducts();

        }

    }
);


/* ================= PAGE LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        applyURLSearch();

    }
);