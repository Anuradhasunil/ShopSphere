/* =========================================================
   SHOPNOVA COMPLETE JAVASCRIPT
========================================================= */


/* =========================================================
   PRODUCT DATABASE
========================================================= */

const products = [

    {
        id: 1,
        name: "Premium Loungewear",
        category: "Fashion",
        price: 1499,
        image: "images/loungewear.jpg",
        description: "Comfortable and stylish premium loungewear."
    },

    {
        id: 2,
        name: "Premium Sunglasses",
        category: "Accessories",
        price: 1299,
        image: "images/sunglasses.jpg",
        description: "Modern sunglasses for everyday style."
    },

    {
        id: 3,
        name: "Men's Premium Shoes",
        category: "Fashion",
        price: 1999,
        image: "images/mens-shoes.jpg",
        description: "Comfortable footwear with a premium look."
    },

    {
        id: 4,
        name: "Luxury Handbag",
        category: "Fashion",
        price: 2499,
        image: "images/bag.jpg",
        description: "Elegant handbag designed for modern style."
    },

    {
        id: 5,
        name: "Wireless Earbuds",
        category: "Electronics",
        price: 1799,
        image: "images/earbuds.jpg",
        description: "Enjoy wireless audio wherever you go."
    },

    {
        id: 6,
        name: "Luxury Collection",
        category: "Lifestyle",
        price: 3999,
        image: "images/luxury-banner.jpg",
        description: "Premium lifestyle collection."
    },

    {
        id: 7,
        name: "Beauty Makeup Collection",
        category: "Beauty",
        price: 999,
        image: "images/makeup.jpg",
        description: "Beautiful everyday makeup essentials."
    },

    {
        id: 8,
        name: "Premium Perfume",
        category: "Lifestyle",
        price: 1599,
        image: "images/perfume.jpg",
        description: "A sophisticated fragrance for every occasion."
    },

    {
        id: 9,
        name: "Premium Suit",
        category: "Fashion",
        price: 4999,
        image: "images/suit.jpg",
        description: "Elegant premium formal wear."
    },

    {
        id: 10,
        name: "Supercar Key",
        category: "Lifestyle",
        price: 5999,
        image: "images/supercar-key.jpg",
        description: "Luxury-inspired premium accessory."
    },

    {
        id: 11,
        name: "Smart Watch",
        category: "Electronics",
        price: 2999,
        image: "images/watch.jpg",
        description: "Smart technology for your everyday lifestyle."
    }

];


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getCart() {

    try {

        const savedCart =
            localStorage.getItem("shopnova_cart");

        if (!savedCart) {
            return [];
        }

        const parsed =
            JSON.parse(savedCart);

        return Array.isArray(parsed)
            ? parsed
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

    localStorage.setItem(
        "shopnova_cart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 1),
        0
    );


    const desktopCount =
        document.getElementById("cartCount");

    const mobileCount =
        document.getElementById("mobileCartCount");


    if (desktopCount) {
        desktopCount.textContent = count;
    }

    if (mobileCount) {
        mobileCount.textContent = count;
    }
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === Number(productId)
        );


    if (!product) {

        console.error(
            "Product not found:",
            productId
        );

        return;
    }


    const cart = getCart();


    const existingItem =
        cart.find(
            item => item.id === product.id
        );


    if (existingItem) {

        existingItem.quantity =
            Number(existingItem.quantity || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            price: product.price,

            image: product.image,

            quantity: 1

        });
    }


    saveCart(cart);


    showNotification(
        `${product.name} added to cart!`
    );
}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {

    let cart = getCart();


    cart =
        cart.filter(
            item => item.id !== Number(productId)
        );


    saveCart(cart);


    renderCart();
}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(productId, change) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === Number(productId)
        );


    if (!item) {
        return;
    }


    item.quantity =
        Number(item.quantity || 1) + Number(change);


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }


    saveCart(cart);

    renderCart();
}


/* =========================================================
   PRICE
========================================================= */

function formatPrice(price) {

    return "₹" +
        Number(price).toLocaleString("en-IN");
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    return `

        <article class="product-card">

            <div class="product-image-wrapper">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                    loading="lazy"
                    onerror="this.src='images/luxury-banner.jpg'"
                >

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>


                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        type="button"
                        class="add-cart-button"
                        onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>

    `;
}


/* =========================================================
   HOME PRODUCTS
========================================================= */

function renderHomeProducts() {

    const grid =
        document.getElementById(
            "homeProductGrid"
        );


    if (!grid) {
        return;
    }


    const featuredProducts =
        products.slice(0, 8);


    grid.innerHTML =
        featuredProducts
            .map(createProductCard)
            .join("");
}


/* =========================================================
   PRODUCTS PAGE
========================================================= */

function renderProductsPage() {

    const grid =
        document.getElementById(
            "productsGrid"
        );


    if (!grid) {
        return;
    }


    const searchInput =
        document.getElementById(
            "productSearch"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    function render() {

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const category =
            categoryFilter
                ? categoryFilter.value
                : "all";


        const filtered =
            products.filter(product => {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(search) ||

                    product.category
                        .toLowerCase()
                        .includes(search) ||

                    product.description
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "all" ||
                    product.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );
            });


        if (filtered.length === 0) {

            grid.innerHTML = `

                <div class="cart-empty"
                     style="grid-column:1/-1;">

                    <div class="cart-empty-icon">
                        🔎
                    </div>

                    <h2>
                        No products found
                    </h2>

                    <p>
                        Try another search.
                    </p>

                </div>

            `;

            return;
        }


        grid.innerHTML =
            filtered
                .map(createProductCard)
                .join("");
    }


    if (searchInput) {
        searchInput.addEventListener(
            "input",
            render
        );
    }


    if (categoryFilter) {
        categoryFilter.addEventListener(
            "change",
            render
        );
    }


    render();


    /* URL SEARCH */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const urlSearch =
        urlParams.get("search");


    if (urlSearch && searchInput) {

        searchInput.value =
            urlSearch;

        render();
    }
}


/* =========================================================
   CART PAGE
========================================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    const empty =
        document.getElementById(
            "cartEmpty"
        );


    const layout =
        document.getElementById(
            "cartLayout"
        );


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!container) {
        return;
    }


    const cart = getCart();


    if (cart.length === 0) {

        if (empty) {
            empty.style.display = "block";
        }

        if (layout) {
            layout.style.display = "none";
        }

        return;
    }


    if (empty) {
        empty.style.display = "none";
    }

    if (layout) {
        layout.style.display = "grid";
    }


    container.innerHTML =
        cart.map(item => `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="this.src='images/luxury-banner.jpg'"
                >


                <div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${formatPrice(item.price)}
                    </p>


                    <div style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                        margin-top:10px;
                    ">

                        <button
                            type="button"
                            onclick="changeQuantity(${item.id}, -1)"
                            style="
                                width:30px;
                                height:30px;
                                border:1px solid #cbd5e1;
                                background:white;
                                border-radius:6px;
                            ">
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            type="button"
                            onclick="changeQuantity(${item.id}, 1)"
                            style="
                                width:30px;
                                height:30px;
                                border:1px solid #cbd5e1;
                                background:white;
                                border-radius:6px;
                            ">
                            +
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="remove-button"
                    onclick="removeFromCart(${item.id})">
                    Remove
                </button>

            </div>

        `)
        .join("");


    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity || 1),
            0
        );


    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(subtotal);
    }


    if (totalElement) {
        totalElement.textContent =
            formatPrice(subtotal);
    }
}


/* =========================================================
   CHECKOUT
========================================================= */

function renderCheckout() {

    const summary =
        document.getElementById(
            "checkoutSummary"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    if (!summary) {
        return;
    }


    const cart = getCart();


    if (cart.length === 0) {

        summary.innerHTML = `

            <p style="
                color:#64748b;
                line-height:1.6;
            ">
                Your cart is empty.
                Please add products before checkout.
            </p>

            <a
                href="products.html"
                class="primary-button"
                style="
                    margin-top:18px;
                    width:100%;
                ">
                Browse Products
            </a>

        `;

        if (totalElement) {
            totalElement.textContent =
                "₹0";
        }

        return;
    }


    let total = 0;


    summary.innerHTML =
        cart.map(item => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity || 1);


            total += itemTotal;


            return `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    padding:10px 0;
                    border-bottom:1px solid #e2e8f0;
                ">

                    <span style="
                        color:#475569;
                        font-size:14px;
                    ">
                        ${item.name}
                        × ${item.quantity}
                    </span>

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                </div>

            `;

        })
        .join("");


    if (totalElement) {
        totalElement.textContent =
            formatPrice(total);
    }
}


/* =========================================================
   CHECKOUT SUBMIT
========================================================= */

function submitOrder(event) {

    event.preventDefault();


    const cart = getCart();


    if (cart.length === 0) {

        showNotification(
            "Your cart is empty."
        );

        return;
    }


    const form =
        event.target;


    const success =
        document.getElementById(
            "successMessage"
        );


    if (success) {

        success.style.display =
            "block";

        success.innerHTML = `

            ✓ Order request submitted successfully!

            <br><br>

            Thank you for shopping with ShopNova.

        `;
    }


    localStorage.removeItem(
        "shopnova_cart"
    );


    updateCartCount();

    renderCheckout();


    form.reset();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function performSearch() {

    const input =
        document.getElementById(
            "globalSearch"
        );


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


/* =========================================================
   SEARCH ENTER KEY
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "globalSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                performSearch();
            }

        }
    );
}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );


    if (!menu) {
        return;
    }


    menu.classList.toggle(
        "open"
    );
}


/* =========================================================
   CONTACT
========================================================= */

function openContact() {

    const modal =
        document.getElementById(
            "contactModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }
}


function closeContact() {

    const modal =
        document.getElementById(
            "contactModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }
}


/* =========================================================
   CLOSE MODAL OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "contactModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeContact();

        }

    }
);


/* =========================================================
   ESCAPE MODAL
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeContact();

        }

    }
);


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(message) {

    let notification =
        document.getElementById(
            "shopnovaNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.id =
            "shopnovaNotification";


        notification.style.position =
            "fixed";

        notification.style.right =
            "20px";

        notification.style.bottom =
            "20px";

        notification.style.zIndex =
            "30000";

        notification.style.background =
            "#172554";

        notification.style.color =
            "white";

        notification.style.padding =
            "15px 20px";

        notification.style.borderRadius =
            "10px";

        notification.style.fontWeight =
            "700";

        notification.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.2)";


        document.body.appendChild(
            notification
        );
    }


    notification.textContent =
        message;


    notification.style.display =
        "block";


    clearTimeout(
        window.shopnovaNotificationTimer
    );


    window.shopnovaNotificationTimer =
        setTimeout(
            function() {

                notification.style.display =
                    "none";

            },
            2500
        );
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        renderHomeProducts();

        renderProductsPage();

        renderCart();

        renderCheckout();

        setupSearch();

    }
);