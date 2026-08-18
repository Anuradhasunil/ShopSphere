"use strict";

/* =========================================================
   SHOPNOVA GLOBAL SCRIPT
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
            "Cart saving error:",
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
            (sum, item) => {

                return sum +
                    (Number(item.quantity) || 0);

            },
            0
        );

    document
        .querySelectorAll(
            ".cart-count, #cartCount, .cart-badge"
        )
        .forEach(
            counter => {

                counter.textContent =
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
    button = null
) {

    const cart =
        getCart();

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

            name:
                productName,

            price:
                Number(price) || 0,

            image:
                image || "",

            quantity:
                1
        });
    }


    saveCart(cart);

    updateCartCount();


    if (button) {

        const oldText =
            button.innerHTML;

        button.innerHTML =
            "✓ Added";

        button.classList.add(
            "added"
        );

        button.disabled =
            true;


        setTimeout(
            () => {

                button.innerHTML =
                    oldText;

                button.classList.remove(
                    "added"
                );

                button.disabled =
                    false;

            },
            1200
        );
    }


    showMessage(
        productName +
        " added to cart!"
    );
}


/* =========================================================
   COMPATIBILITY
========================================================= */

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


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message) {

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

        box.style.right =
            "20px";

        box.style.bottom =
            "20px";

        box.style.zIndex =
            "999999";

        box.style.background =
            "#0b3478";

        box.style.color =
            "#ffffff";

        box.style.padding =
            "13px 18px";

        box.style.borderRadius =
            "10px";

        box.style.fontSize =
            "13px";

        box.style.fontWeight =
            "700";

        box.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.22)";

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
            () => {

                box.style.opacity =
                    "0";

            },
            1800
        );
}


/* =========================================================
   CONTACT POPUP
========================================================= */

function setupContactPopup() {

    const button =
        document.getElementById(
            "contactBtn"
        );

    const overlay =
        document.getElementById(
            "contactOverlay"
        );

    const close =
        document.getElementById(
            "contactClose"
        );


    if (!button || !overlay) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            overlay.classList.add(
                "show"
            );

            document.body.style.overflow =
                "hidden";
        }
    );


    if (close) {

        close.addEventListener(
            "click",
            closeContact
        );
    }


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                closeContact();
            }
        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeContact();
            }
        }
    );


    function closeContact() {

        overlay.classList.remove(
            "show"
        );

        document.body.style.overflow =
            "";
    }
}


/* =========================================================
   PRODUCT DATABASE FOR HOMEPAGE SEARCH
========================================================= */

const SHOPNOVA_PRODUCTS = [

    {
        name:
            "Bible Wonders",

        price:
            999,

        image:
            "images/bible-wonders.jpg",

        category:
            "Books"
    },

    {
        name:
            "Women's Shoes",

        price:
            1499,

        image:
            "images/womens-shoes.jpg",

        category:
            "Women's Fashion"
    },

    {
        name:
            "Men's Suit Tuxedo",

        price:
            3999,

        image:
            "images/tuxedo.jpg",

        category:
            "Men's Fashion"
    },

    {
        name:
            "Premium Watch",

        price:
            2999,

        image:
            "images/watch.jpg",

        category:
            "Accessories"
    },

    {
        name:
            "Luxury Perfume",

        price:
            1999,

        image:
            "images/perfume.jpg",

        category:
            "Beauty"
    },

    {
        name:
            "Men's Shoes",

        price:
            1799,

        image:
            "images/mens-shoes.jpg",

        category:
            "Men's Fashion"
    },

    {
        name:
            "Premium Sunglasses",

        price:
            1299,

        image:
            "images/sunglasses.jpg",

        category:
            "Accessories"
    },

    {
        name:
            "Luxury Handbag",

        price:
            2499,

        image:
            "images/bag.jpg",

        category:
            "Women's Fashion"
    },

    {
        name:
            "Premium Makeup",

        price:
            1599,

        image:
            "images/makeup.jpg",

        category:
            "Beauty"
    },

    {
        name:
            "Comfort Loungewear",

        price:
            1199,

        image:
            "images/loungewear.jpg",

        category:
            "Fashion"
    },

    {
        name:
            "Premium Earbuds",

        price:
            2199,

        image:
            "images/earbuds.jpg",

        category:
            "Electronics"
    },

    {
        name:
            "Supercar Key",

        price:
            4999,

        image:
            "images/supercar-key.jpg",

        category:
            "Luxury"
    }

];


/* =========================================================
   HOMEPAGE SEARCH
========================================================= */

function setupHomeSearch() {

    const input =
        document.getElementById(
            "homeSearchInput"
        );

    const button =
        document.getElementById(
            "homeSearchBtn"
        );

    const results =
        document.getElementById(
            "homeSearchResults"
        );

    const grid =
        document.getElementById(
            "homeProductGrid"
        );

    const noResults =
        document.getElementById(
            "homeNoResults"
        );

    const clear =
        document.getElementById(
            "clearHomeSearch"
        );


    if (
        !input ||
        !results ||
        !grid
    ) {
        return;
    }


    function performSearch() {

        const query =
            input.value
                .trim()
                .toLowerCase();


        if (!query) {

            results.style.display =
                "none";

            grid.innerHTML =
                "";

            noResults.style.display =
                "none";

            return;
        }


        const matches =
            SHOPNOVA_PRODUCTS.filter(
                product => {

                    return (

                        product.name
                            .toLowerCase()
                            .includes(query)

                        ||

                        product.category
                            .toLowerCase()
                            .includes(query)
                    );
                }
            );


        results.style.display =
            "block";


        grid.innerHTML =
            "";


        if (
            matches.length === 0
        ) {

            noResults.style.display =
                "block";

            return;
        }


        noResults.style.display =
            "none";


        matches.forEach(
            product => {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "home-product-card";


                card.innerHTML = `

                    <img
                        src="${product.image}"
                        alt="${escapeHTML(product.name)}"
                        class="home-product-image"
                        loading="lazy"
                        onerror="this.style.display='none';"
                    >

                    <div class="home-product-info">

                        <h3>
                            ${escapeHTML(product.name)}
                        </h3>

                        <div class="home-product-price">
                            ₹${Number(product.price).toLocaleString("en-IN")}
                        </div>

                        <button
                            type="button"
                            class="home-add-cart"
                        >
                            🛒 Add to Cart
                        </button>

                    </div>
                `;


                const cartButton =
                    card.querySelector(
                        ".home-add-cart"
                    );


                cartButton.addEventListener(
                    "click",
                    () => {

                        addToCart(
                            product.name,
                            product.price,
                            product.image,
                            cartButton
                        );
                    }
                );


                grid.appendChild(
                    card
                );
            }
        );


        results.scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });
    }


    if (button) {

        button.addEventListener(
            "click",
            performSearch
        );
    }


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                performSearch();
            }
        }
    );


    input.addEventListener(
        "input",
        () => {

            if (
                input.value.trim() === ""
            ) {

                results.style.display =
                    "none";

                grid.innerHTML =
                    "";

                noResults.style.display =
                    "none";

            } else {

                performSearch();
            }
        }
    );


    if (clear) {

        clear.addEventListener(
            "click",
            () => {

                input.value =
                    "";

                results.style.display =
                    "none";

                grid.innerHTML =
                    "";

                noResults.style.display =
                    "none";

                input.focus();
            }
        );
    }
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   STORAGE SYNC
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            CART_KEY
        ) {

            updateCartCount();
        }
    }
);


/* =========================================================
   PAGE READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        setupHomeSearch();

        setupContactPopup();

    }
);