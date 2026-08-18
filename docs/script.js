"use strict";


/* =====================================================
   SHOPNOVA CART
===================================================== */

const CART_KEY = "shopnova_cart";


/* =====================================================
   GET CART
===================================================== */

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


/* =====================================================
   SAVE CART
===================================================== */

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


/* =====================================================
   CART COUNT
===================================================== */

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


/* =====================================================
   ADD TO CART
===================================================== */

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
            button.textContent;

        button.textContent =
            "✓ Added to Cart";


        button.style.opacity =
            "0.85";


        setTimeout(
            () => {

                button.textContent =
                    oldText;

                button.style.opacity =
                    "";

            },
            1200
        );
    }


    showMessage(
        productName +
        " added to cart!"
    );
}


/* =====================================================
   COMPATIBILITY
===================================================== */

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
            "linear-gradient(135deg,#0a397b,#315bd8)";


        box.style.color =
            "#ffffff";


        box.style.padding =
            "13px 18px";


        box.style.borderRadius =
            "11px";


        box.style.fontSize =
            "13px";


        box.style.fontWeight =
            "700";


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
            () => {

                box.style.opacity =
                    "0";

            },
            1800
        );
}


/* =====================================================
   HOMEPAGE PRODUCTS
===================================================== */

/*
    IMPORTANT:

    These image names match your existing
    docs/images folder.

    Do not change your logo image.
*/

const SHOPNOVA_PRODUCTS = [

    {
        name: "Bible Wonders",
        price: 999,
        image: "images/bible-wonders.jpg",
        category: "Books"
    },

    {
        name: "Women's Shoes",
        price: 1499,
        image: "images/womens-shoes.jpg",
        category: "Women's Fashion"
    },

    {
        name: "Men's Suit Tuxedo",
        price: 3999,
        image: "images/tuxedo.jpg",
        category: "Men's Fashion"
    },

    {
        name: "Luxury Perfume",
        price: 1999,
        image: "images/perfume.jpg",
        category: "Beauty"
    },

    {
        name: "Men's Shoes",
        price: 1799,
        image: "images/mens-shoes.jpg",
        category: "Men's Fashion"
    },

    {
        name: "Premium Sunglasses",
        price: 1299,
        image: "images/sunglasses.jpg",
        category: "Accessories"
    },

    {
        name: "Luxury Handbag",
        price: 2499,
        image: "images/bag.jpg",
        category: "Women's Fashion"
    },

    {
        name: "Premium Makeup",
        price: 1599,
        image: "images/makeup.jpg",
        category: "Beauty"
    },

    {
        name: "Comfort Loungewear",
        price: 1199,
        image: "images/loungewear.jpg",
        category: "Fashion"
    },

    {
        name: "Premium Earbuds",
        price: 2199,
        image: "images/earbuds.jpg",
        category: "Electronics"
    },

    {
        name: "Supercar Key",
        price: 4999,
        image: "images/supercar-key.jpg",
        category: "Luxury"
    }

];


/* =====================================================
   HOMEPAGE SEARCH
===================================================== */

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


    /* =================================================
       PERFORM SEARCH
    ================================================= */

    function performSearch(
        shouldScroll = true
    ) {

        const query =
            input.value
                .trim()
                .toLowerCase();


        /* EMPTY SEARCH */

        if (!query) {

            results.style.display =
                "none";

            grid.innerHTML =
                "";

            if (noResults) {

                noResults.style.display =
                    "none";
            }

            return;
        }


        /* FIND PRODUCTS */

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


        /* NO MATCH */

        if (
            matches.length === 0
        ) {

            if (noResults) {

                noResults.style.display =
                    "block";
            }

            return;
        }


        if (noResults) {

            noResults.style.display =
                "none";
        }


        /* =================================================
           CREATE PRODUCTS
        ================================================= */

        matches.forEach(
            product => {


                /* CARD */

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "home-product-card";


                /* INNER */

                const inner =
                    document.createElement(
                        "div"
                    );

                inner.className =
                    "home-product-card-inner";


                /* =================================================
                   FRONT
                ================================================= */

                const front =
                    document.createElement(
                        "div"
                    );

                front.className =
                    "home-product-front";


                /* IMAGE */

                const image =
                    document.createElement(
                        "img"
                    );

                image.className =
                    "home-product-image";

                image.src =
                    product.image;

                image.alt =
                    product.name;

                image.loading =
                    "lazy";


                /* INFO */

                const info =
                    document.createElement(
                        "div"
                    );

                info.className =
                    "home-product-info";


                /* CATEGORY */

                const category =
                    document.createElement(
                        "div"
                    );

                category.className =
                    "home-product-category";

                category.textContent =
                    product.category;


                /* NAME */

                const title =
                    document.createElement(
                        "h3"
                    );

                title.textContent =
                    product.name;


                /* PRICE */

                const price =
                    document.createElement(
                        "div"
                    );

                price.className =
                    "home-product-price";

                price.textContent =
                    "₹" +
                    Number(
                        product.price
                    ).toLocaleString(
                        "en-IN"
                    );


                /* HINT */

                const hint =
                    document.createElement(
                        "div"
                    );

                hint.className =
                    "home-product-hint";

                hint.textContent =
                    "↻ Click to inspect product";


                info.appendChild(
                    category
                );

                info.appendChild(
                    title
                );

                info.appendChild(
                    price
                );

                info.appendChild(
                    hint
                );


                front.appendChild(
                    image
                );

                front.appendChild(
                    info
                );


                /* =================================================
                   BACK
                ================================================= */

                const back =
                    document.createElement(
                        "div"
                    );

                back.className =
                    "home-product-back";


                /* ICON */

                const backIcon =
                    document.createElement(
                        "div"
                    );

                backIcon.className =
                    "back-icon";

                backIcon.textContent =
                    "✦";


                /* TITLE */

                const backTitle =
                    document.createElement(
                        "h3"
                    );

                backTitle.textContent =
                    product.name;


                /* CATEGORY */

                const backCategory =
                    document.createElement(
                        "div"
                    );

                backCategory.className =
                    "back-category";

                backCategory.textContent =
                    product.category;


                /* PRICE */

                const backPrice =
                    document.createElement(
                        "div"
                    );

                backPrice.className =
                    "back-price";

                backPrice.textContent =
                    "₹" +
                    Number(
                        product.price
                    ).toLocaleString(
                        "en-IN"
                    );


                /* DESCRIPTION */

                const backDescription =
                    document.createElement(
                        "p"
                    );

                backDescription.textContent =
                    "Premium ShopNova selection. Check this product and add it to your shopping cart.";


                /* ADD BUTTON */

                const backAction =
                    document.createElement(
                        "div"
                    );

                backAction.className =
                    "back-action";

                backAction.textContent =
                    "🛒 Add to Cart";


                back.appendChild(
                    backIcon
                );

                back.appendChild(
                    backTitle
                );

                back.appendChild(
                    backCategory
                );

                back.appendChild(
                    backPrice
                );

                back.appendChild(
                    backDescription
                );

                back.appendChild(
                    backAction
                );


                /* =================================================
                   BUILD CARD
                ================================================= */

                inner.appendChild(
                    front
                );

                inner.appendChild(
                    back
                );

                card.appendChild(
                    inner
                );

                grid.appendChild(
                    card
                );


                /* =================================================
                   CLICK CARD = ROTATE
                ================================================= */

                card.addEventListener(
                    "click",
                    event => {

                        /*
                            If Add to Cart was clicked,
                            do not rotate again.
                        */

                        if (
                            event.target.closest(
                                ".back-action"
                            )
                        ) {

                            return;
                        }


                        card.classList.toggle(
                            "flipped"
                        );

                    }
                );


                /* =================================================
                   ADD TO CART
                ================================================= */

                backAction.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        addToCart(

                            product.name,

                            product.price,

                            product.image,

                            backAction

                        );

                    }
                );

            }
        );


        /* SCROLL */

        if (shouldScroll) {

            setTimeout(
                () => {

                    results.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                },
                50
            );
        }
    }


    /* =================================================
       SEARCH BUTTON
    ================================================= */

    if (button) {

        button.addEventListener(
            "click",
            () => {

                performSearch(
                    true
                );

            }
        );
    }


    /* =================================================
       ENTER
    ================================================= */

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                performSearch(
                    true
                );
            }

        }
    );


    /* =================================================
       LIVE SEARCH
    ================================================= */

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

                if (noResults) {

                    noResults.style.display =
                        "none";
                }

            } else {

                performSearch(
                    false
                );
            }

        }
    );


    /* =================================================
       CLEAR
    ================================================= */

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

                if (noResults) {

                    noResults.style.display =
                        "none";
                }

                input.focus();

            }
        );
    }
}


/* =====================================================
   CONTACT POPUP
===================================================== */

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


    if (
        !button ||
        !overlay
    ) {

        return;
    }


    /* OPEN */

    function openContact() {

        overlay.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";
    }


    /* CLOSE */

    function closeContact() {

        overlay.classList.remove(
            "show"
        );

        document.body.style.overflow =
            "";
    }


    button.addEventListener(
        "click",
        openContact
    );


    if (close) {

        close.addEventListener(
            "click",
            closeContact
        );
    }


    /* CLICK OUTSIDE */

    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeContact();
            }

        }
    );


    /* ESCAPE */

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
}


/* =====================================================
   CART STORAGE SYNC
===================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key === CART_KEY
        ) {

            updateCartCount();
        }

    }
);


/* =====================================================
   PAGE READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        setupHomeSearch();

        setupContactPopup();

    }
);