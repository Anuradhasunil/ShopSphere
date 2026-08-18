"use strict";


/* =====================================================
   SHOPNOVA CART
===================================================== */

const CART_KEY = "shopnova_cart";


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

            name: productName,

            price: Number(price) || 0,

            image: image || "",

            quantity: 1

        });
    }


    saveCart(cart);

    updateCartCount();


    if (button) {

        const oldText =
            button.innerHTML;

        button.innerHTML =
            "✓ Added";

        button.disabled =
            true;


        setTimeout(
            () => {

                button.innerHTML =
                    oldText;

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
   HOMEPAGE SEARCH PRODUCTS
===================================================== */

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
        name: "Premium Watch",
        price: 2999,
        image: "images/watch.jpg",
        category: "Accessories"
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


    function performSearch(
        shouldScroll = true
    ) {

        const query =
            input.value
                .trim()
                .toLowerCase();


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


        matches.forEach(
            product => {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "home-product-card";


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


                const info =
                    document.createElement(
                        "div"
                    );

                info.className =
                    "home-product-info";


                const title =
                    document.createElement(
                        "h3"
                    );

                title.textContent =
                    product.name;


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


                const cartButton =
                    document.createElement(
                        "button"
                    );

                cartButton.type =
                    "button";

                cartButton.className =
                    "home-add-cart";

                cartButton.textContent =
                    "🛒 Add to Cart";


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


                info.appendChild(title);

                info.appendChild(price);

                info.appendChild(cartButton);

                card.appendChild(image);

                card.appendChild(info);

                grid.appendChild(card);
            }
        );


        if (shouldScroll) {

            setTimeout(
                () => {

                    results.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                50
            );
        }
    }


    button?.addEventListener(
        "click",
        () => performSearch(true)
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                performSearch(true);
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

                if (noResults) {

                    noResults.style.display =
                        "none";
                }

            } else {

                performSearch(false);
            }
        }
    );


    clear?.addEventListener(
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


    if (!button || !overlay) {
        return;
    }


    function openContact() {

        overlay.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";
    }


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


    close?.addEventListener(
        "click",
        closeContact
    );


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
   STORAGE SYNC
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