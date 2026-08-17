/* =========================================================
   SHOPNOVA - COMPLETE JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   CART STORAGE
   ========================================================= */

const CART_KEY = "shopnova_cart";


function getCart() {

    try {

        const savedCart =
            localStorage.getItem(CART_KEY);

        if (!savedCart) {
            return [];
        }

        const cart =
            JSON.parse(savedCart);

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "ShopNova cart error:",
            error
        );

        return [];
    }
}


function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const cart =
        getCart();

    let totalQuantity = 0;

    cart.forEach(item => {

        const quantity =
            Number(item.quantity) || 0;

        totalQuantity += quantity;

    });

    cartCount.textContent =
        totalQuantity;
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
    name,
    price,
    image
) {

    const cart =
        getCart();

    const existing =
        cart.find(
            item => item.name === name
        );


    if (existing) {

        existing.quantity =
            (Number(existing.quantity) || 0) + 1;

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


    /*
       Small confirmation without
       breaking the page.
    */

    showToast(
        `${name} added to cart`
    );
}


/* =========================================================
   PRODUCT BUTTONS
   ========================================================= */

function setupProductButtons() {

    const buttons =
        document.querySelectorAll(
            ".add-cart-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const name =
                    this.dataset.name;

                const price =
                    Number(
                        this.dataset.price
                    );

                const image =
                    this.dataset.image;


                if (!name || !price) {

                    console.error(
                        "Invalid product:",
                        this
                    );

                    return;
                }


                addToCart(
                    name,
                    price,
                    image
                );

            }
        );

    });

}


/* =========================================================
   SEARCH
   ========================================================= */

function performSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {
        return;
    }


    const query =
        input.value
            .trim()
            .toLowerCase();


    if (!query) {

        window.location.href =
            "products.html";

        return;
    }


    /*
       Products page receives
       the search query.
    */

    window.location.href =
        "products.html?search=" +
        encodeURIComponent(query);
}


/* =========================================================
   SEARCH BUTTON
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


    if (!input || !button) {
        return;
    }


    button.addEventListener(
        "click",
        performSearch
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                performSearch();

            }

        }
    );

}


/* =========================================================
   PRODUCT SEARCH FILTER
   ========================================================= */

function filterProductsFromURL() {

    const grid =
        document.getElementById(
            "productsGrid"
        );


    if (!grid) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const search =
        (
            params.get("search") || ""
        )
        .trim()
        .toLowerCase();


    if (!search) {
        return;
    }


    const cards =
        grid.querySelectorAll(
            ".product-card"
        );


    let found = 0;


    cards.forEach(card => {

        const nameElement =
            card.querySelector(
                ".product-name"
            );

        const categoryElement =
            card.querySelector(
                ".product-category"
            );


        const name =
            nameElement
                ? nameElement.textContent
                    .toLowerCase()
                : "";


        const category =
            categoryElement
                ? categoryElement.textContent
                    .toLowerCase()
                : "";


        const matches =
            name.includes(search) ||
            category.includes(search);


        if (matches) {

            card.style.display =
                "";

            found++;

        } else {

            card.style.display =
                "none";

        }

    });


    let noResults =
        document.getElementById(
            "noSearchResults"
        );


    if (found === 0) {

        if (!noResults) {

            noResults =
                document.createElement(
                    "div"
                );

            noResults.id =
                "noSearchResults";

            noResults.style.gridColumn =
                "1 / -1";

            noResults.style.padding =
                "50px 20px";

            noResults.style.textAlign =
                "center";

            noResults.style.color =
                "#60798c";

            noResults.innerHTML = `
                <h2 style="color:#16366b;margin-bottom:8px;">
                    No products found
                </h2>
                <p>
                    Try another product name or category.
                </p>
            `;

            grid.appendChild(
                noResults
            );
        }

    } else if (noResults) {

        noResults.remove();

    }

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "shopnovaToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "shopnovaToast";


        toast.style.position =
            "fixed";

        toast.style.right =
            "20px";

        toast.style.bottom =
            "20px";

        toast.style.zIndex =
            "9999";

        toast.style.background =
            "linear-gradient(135deg,#16366b,#078568)";

        toast.style.color =
            "#fff";

        toast.style.padding =
            "12px 18px";

        toast.style.borderRadius =
            "10px";

        toast.style.fontSize =
            "13px";

        toast.style.fontWeight =
            "700";

        toast.style.boxShadow =
            "0 8px 25px rgba(0,0,0,.18)";

        toast.style.opacity =
            "0";

        toast.style.transform =
            "translateY(10px)";

        toast.style.transition =
            ".25s";


        document.body.appendChild(
            toast
        );
    }


    toast.textContent =
        "✓ " + message;


    requestAnimationFrame(() => {

        toast.style.opacity =
            "1";

        toast.style.transform =
            "translateY(0)";

    });


    clearTimeout(
        window.shopNovaToastTimer
    );


    window.shopNovaToastTimer =
        setTimeout(() => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(10px)";

        }, 2200);

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        setupSearch();

        setupProductButtons();

        filterProductsFromURL();

    }
);