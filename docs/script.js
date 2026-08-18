"use strict";


/* =========================================================
   SHOPNOVA JAVASCRIPT
   ========================================================= */


/* =========================================================
   CART STORAGE
   ========================================================= */

const CART_KEY = "shopnova_cart";


/* =========================================================
   GET CART
   ========================================================= */

function getCart() {

    try {

        const saved =
            localStorage.getItem(CART_KEY);

        if (!saved) {
            return [];
        }

        const cart =
            JSON.parse(saved);

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart;

    } catch (error) {

        console.error(
            "ShopNova cart error:",
            error
        );

        return [];
    }
}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart(cart) {

    try {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "ShopNova could not save cart:",
            error
        );
    }
}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const cart =
        getCart();


    const total =
        cart.reduce(
            function (sum, item) {

                return sum +
                    (Number(item.quantity) || 0);

            },
            0
        );


    const elements =
        document.querySelectorAll(
            ".cart-count, #cartCount, .cart-badge"
        );


    elements.forEach(
        function (element) {

            element.textContent =
                total;

        }
    );
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
    productName,
    price,
    image,
    button
) {

    let cart =
        getCart();


    const existing =
        cart.find(
            function (item) {

                return item.name ===
                    productName;

            }
        );


    if (existing) {

        existing.quantity =
            (Number(existing.quantity) || 0) + 1;

    } else {

        cart.push({

            name: productName,

            price: Number(price),

            image: image,

            quantity: 1

        });
    }


    saveCart(cart);


    updateCartCount();


    /* =========================================
       BUTTON FEEDBACK
    ========================================== */

    if (button) {

        const original =
            button.innerHTML;


        button.innerHTML =
            "✓ Added to Cart";


        button.classList.add(
            "added"
        );


        button.disabled = true;


        setTimeout(
            function () {

                button.innerHTML =
                    original;

                button.classList.remove(
                    "added"
                );

                button.disabled = false;

            },
            1200
        );
    }


    showCartMessage(
        productName +
        " added to cart!"
    );
}


/* =========================================================
   OLD add() FUNCTION
   ---------------------------------------------------------
   Keeps older ShopNova buttons working.
   ========================================================= */

function add(
    productName,
    price,
    image
) {

    addToCart(
        productName,
        price,
        image,
        null
    );
}


/* =========================================================
   CART NOTIFICATION
   ========================================================= */

function showCartMessage(
    message
) {

    let box =
        document.getElementById(
            "shopnovaMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.id =
            "shopnovaMessage";


        box.style.position =
            "fixed";


        box.style.bottom =
            "25px";


        box.style.right =
            "25px";


        box.style.zIndex =
            "999999";


        box.style.background =
            "#071a3d";


        box.style.color =
            "#ffffff";


        box.style.padding =
            "14px 20px";


        box.style.borderRadius =
            "12px";


        box.style.fontWeight =
            "700";


        box.style.fontSize =
            "14px";


        box.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.25)";


        box.style.transition =
            "opacity .3s ease";


        document.body.appendChild(
            box
        );
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
            function () {

                box.style.opacity =
                    "0";

            },
            1800
        );
}


/* =========================================================
   SEARCH PRODUCTS
   ========================================================= */

function searchProducts(
    query
) {

    const products =
        document.querySelectorAll(
            ".product-card"
        );


    const noResults =
        document.getElementById(
            "noResults"
        );


    const result =
        document.getElementById(
            "searchResult"
        );


    if (!products.length) {
        return;
    }


    const clean =
        String(query || "")
            .trim()
            .toLowerCase();


    let visible =
        0;


    products.forEach(
        function (product) {

            const name =
                (
                    product.dataset.name ||
                    product
                        .querySelector(
                            ".product-name"
                        )
                        ?.textContent ||
                    ""
                )
                .toLowerCase();


            const category =
                (
                    product.dataset.category ||
                    product
                        .querySelector(
                            ".product-category"
                        )
                        ?.textContent ||
                    ""
                )
                .toLowerCase();


            const description =
                (
                    product
                        .querySelector(
                            ".product-description"
                        )
                        ?.textContent ||
                    ""
                )
                .toLowerCase();


            const match =
                clean === "" ||
                name.includes(clean) ||
                category.includes(clean) ||
                description.includes(clean);


            if (match) {

                product.style.display =
                    "flex";

                visible++;

            } else {

                product.style.display =
                    "none";
            }

        }
    );


    /* =========================================
       NO RESULTS
    ========================================== */

    if (noResults) {

        noResults.style.display =
            visible === 0
                ? "block"
                : "none";
    }


    /* =========================================
       RESULT TEXT
    ========================================== */

    if (result) {

        if (clean === "") {

            result.style.display =
                "none";

            result.textContent =
                "";

        } else {

            result.style.display =
                "block";

            result.textContent =
                visible +
                " product(s) found for \"" +
                query +
                "\"";
        }
    }
}


/* =========================================================
   SEARCH SETUP
   ========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const button =
        document.getElementById(
            "searchBtn"
        );


    if (!input) {
        return;
    }


    /* =========================================
       SEARCH BUTTON
    ========================================== */

    if (button) {

        button.addEventListener(
            "click",
            function () {

                const query =
                    input.value.trim();


                const productsPage =
                    window.location.pathname
                        .toLowerCase()
                        .includes(
                            "products.html"
                        );


                if (productsPage) {

                    searchProducts(
                        query
                    );

                } else {

                    if (query) {

                        window.location.href =
                            "products.html?search=" +
                            encodeURIComponent(
                                query
                            );

                    } else {

                        window.location.href =
                            "products.html";
                    }
                }

            }
        );
    }


    /* =========================================
       ENTER KEY
    ========================================== */

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                if (button) {

                    button.click();

                }

            }
        }
    );


    /* =========================================
       LIVE SEARCH
    ========================================== */

    input.addEventListener(
        "input",
        function () {

            const productsPage =
                window.location.pathname
                    .toLowerCase()
                    .includes(
                        "products.html"
                    );


            if (productsPage) {

                searchProducts(
                    input.value
                );
            }

        }
    );
}


/* =========================================================
   LOAD SEARCH FROM URL
   ========================================================= */

function loadSearchFromURL() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const query =
        params.get(
            "search"
        );


    if (query) {

        input.value =
            query;

        searchProducts(
            query
        );
    }
}


/* =========================================================
   MOBILE MENU SUPPORT
   ========================================================= */

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuBtn"
        ) ||
        document.getElementById(
            "menu-btn"
        ) ||
        document.querySelector(
            ".menu-btn"
        );


    const menu =
        document.getElementById(
            "nav-menu"
        ) ||
        document.getElementById(
            "navbar"
        ) ||
        document.querySelector(
            ".nav-menu"
        );


    if (!menuButton || !menu) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            menu.classList.toggle(
                "active"
            );

            menu.classList.toggle(
                "show"
            );
        }
    );
}


/* =========================================================
   CART SYNC BETWEEN TABS
   ========================================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            CART_KEY
        ) {

            updateCartCount();
        }

    }
);


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        setupSearch();

        loadSearchFromURL();

        setupMobileMenu();

    }
);