"use strict";

const CART_KEY = "shopnova_cart";


/* =========================
   GET CART
========================= */

function getCart() {

    try {

        const saved =
            localStorage.getItem(CART_KEY);

        if (!saved) {
            return [];
        }

        const cart =
            JSON.parse(saved);

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );

        return [];
    }
}


/* =========================
   SAVE CART
========================= */

function saveCart(cart) {

    try {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error(
            "Cart saving error:",
            error
        );
    }
}


/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

    const cart = getCart();

    const total =
        cart.reduce(
            (sum, item) => {

                return sum +
                    (Number(item.quantity) || 0);

            },
            0
        );

    const counters =
        document.querySelectorAll(
            ".cart-count, #cartCount, .cart-badge"
        );

    counters.forEach(
        counter => {

            counter.textContent = total;

        }
    );
}


/* =========================
   ADD TO CART
========================= */

function addToCart(
    productName,
    price,
    image,
    button = null
) {

    const cart = getCart();

    const existing =
        cart.find(
            item =>
                item.name === productName
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


    if (button) {

        const oldText =
            button.innerHTML;

        button.innerHTML =
            "✓ Added to Cart";

        button.classList.add("added");

        button.disabled = true;


        setTimeout(
            () => {

                button.innerHTML =
                    oldText;

                button.classList.remove(
                    "added"
                );

                button.disabled = false;

            },
            1200
        );
    }


    showMessage(
        productName +
        " added to cart!"
    );
}


/* =========================
   COMPATIBILITY FUNCTION
========================= */

function add(
    productName,
    price,
    image
) {

    addToCart(
        productName,
        price,
        image
    );
}


/* =========================
   MESSAGE
========================= */

function showMessage(message) {

    let messageBox =
        document.getElementById(
            "shopnovaMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement(
                "div"
            );

        messageBox.id =
            "shopnovaMessage";

        messageBox.style.position =
            "fixed";

        messageBox.style.right =
            "20px";

        messageBox.style.bottom =
            "20px";

        messageBox.style.zIndex =
            "999999";

        messageBox.style.background =
            "#071a3d";

        messageBox.style.color =
            "#ffffff";

        messageBox.style.padding =
            "14px 20px";

        messageBox.style.borderRadius =
            "12px";

        messageBox.style.fontSize =
            "14px";

        messageBox.style.fontWeight =
            "700";

        messageBox.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.25)";

        messageBox.style.transition =
            "opacity .3s ease";

        document.body.appendChild(
            messageBox
        );
    }


    messageBox.textContent =
        "✓ " + message;

    messageBox.style.opacity =
        "1";


    clearTimeout(
        window.shopnovaTimer
    );


    window.shopnovaTimer =
        setTimeout(
            () => {

                messageBox.style.opacity =
                    "0";

            },
            1800
        );
}


/* =========================
   SEARCH PRODUCTS
========================= */

function searchProducts(query) {

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


    const search =
        String(query || "")
            .trim()
            .toLowerCase();


    let found = 0;


    products.forEach(
        product => {

            const name =
                (
                    product.dataset.name ||
                    ""
                ).toLowerCase();


            const category =
                (
                    product.dataset.category ||
                    ""
                ).toLowerCase();


            const description =
                (
                    product.querySelector(
                        ".product-description"
                    )?.textContent ||
                    ""
                ).toLowerCase();


            const matches =
                search === "" ||
                name.includes(search) ||
                category.includes(search) ||
                description.includes(search);


            if (matches) {

                product.style.display =
                    "flex";

                found++;

            } else {

                product.style.display =
                    "none";
            }
        }
    );


    if (noResults) {

        noResults.style.display =
            found === 0
                ? "block"
                : "none";
    }


    if (result) {

        if (search === "") {

            result.style.display =
                "none";

            result.textContent =
                "";

        } else {

            result.style.display =
                "block";

            result.textContent =
                found +
                ' product(s) found for "' +
                query +
                '"';
        }
    }
}


/* =========================
   SEARCH SETUP
========================= */

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


    if (button) {

        button.addEventListener(
            "click",
            () => {

                const query =
                    input.value.trim();


                const productsPage =
                    window.location.pathname
                        .toLowerCase()
                        .includes(
                            "products.html"
                        );


                if (productsPage) {

                    searchProducts(query);

                } else {

                    window.location.href =
                        "products.html?search=" +
                        encodeURIComponent(query);
                }
            }
        );
    }


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                if (button) {
                    button.click();
                }
            }
        }
    );


    input.addEventListener(
        "input",
        () => {

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


/* =========================
   URL SEARCH
========================= */

function loadURLSearch() {

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


    const search =
        params.get("search");


    if (search) {

        input.value = search;

        searchProducts(search);
    }
}


/* =========================
   STORAGE SYNC
========================= */

window.addEventListener(
    "storage",
    event => {

        if (event.key === CART_KEY) {

            updateCartCount();
        }
    }
);


/* =========================
   PAGE READY
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        setupSearch();

        loadURLSearch();

    }
);