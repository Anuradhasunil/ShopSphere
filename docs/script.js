/* =========================================================
   SHOPNOVA SCRIPT.JS
========================================================= */


/* =========================================================
   DEFAULT PRODUCTS
========================================================= */

const defaultProducts = [

    {
        id: 1,
        name: "Premium Headphones",
        category: "Electronics",
        price: 2499,
        description: "Comfortable wireless headphones with premium sound.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
    },

    {
        id: 2,
        name: "Classic Sneakers",
        category: "Fashion",
        price: 1999,
        description: "Modern everyday sneakers designed for comfort.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
    },

    {
        id: 3,
        name: "Smart Watch",
        category: "Electronics",
        price: 3299,
        description: "Smart everyday watch with a clean modern design.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
    },

    {
        id: 4,
        name: "Minimal Backpack",
        category: "Accessories",
        price: 1499,
        description: "Stylish and practical backpack for everyday use.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
    },

    {
        id: 5,
        name: "Modern Sunglasses",
        category: "Accessories",
        price: 899,
        description: "Minimal sunglasses with a premium appearance.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"
    },

    {
        id: 6,
        name: "Desk Lamp",
        category: "Home",
        price: 1199,
        description: "Elegant lamp for your desk or bedside table.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
    },

    {
        id: 7,
        name: "Luxury Watch",
        category: "Fashion",
        price: 4999,
        description: "Classic watch design for a sophisticated look.",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80"
    },

    {
        id: 8,
        name: "Skincare Set",
        category: "Beauty",
        price: 1599,
        description: "Simple skincare essentials for your daily routine.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80"
    }

];


/* =========================================================
   LOCAL STORAGE
========================================================= */

let vendorProducts =
    JSON.parse(
        localStorage.getItem("shopnovaVendorProducts")
    ) || [];

let cart =
    JSON.parse(
        localStorage.getItem("shopnovaCart")
    ) || [];


/* =========================================================
   ELEMENTS
========================================================= */

const productGrid =
    document.getElementById("productGrid");

const vendorProductsContainer =
    document.getElementById("vendorProducts");

const cartItemsContainer =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const summaryItems =
    document.getElementById("summaryItems");

const searchForm =
    document.getElementById("searchForm");

const searchInput =
    document.getElementById("searchInput");

const homeSearchResults =
    document.getElementById("homeSearchResults");

const homeProductGrid =
    document.getElementById("homeProductGrid");

const homeNoResults =
    document.getElementById("homeNoResults");

const searchResultText =
    document.getElementById("searchResultText");

const vendorForm =
    document.getElementById("vendorForm");

const productImage =
    document.getElementById("productImage");

const imagePreview =
    document.getElementById("imagePreview");

const locationBtn =
    document.getElementById("locationBtn");

const mobileMenu =
    document.getElementById("mobileMenu");

const mainNavigation =
    document.getElementById("mainNavigation");

const contactForm =
    document.getElementById("contactForm");

const checkoutBtn =
    document.getElementById("checkoutBtn");


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return "₹" + Number(price).toLocaleString("en-IN");

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message) {

    const box =
        document.getElementById("shopnovaMessage");

    if (!box) {
        return;
    }

    box.textContent = message;

    box.style.display = "block";

    clearTimeout(window.shopnovaMessageTimer);

    window.shopnovaMessageTimer =
        setTimeout(() => {

            box.style.display = "none";

        }, 2500);

}


/* =========================================================
   GET ALL PRODUCTS
========================================================= */

function getAllProducts() {

    return [
        ...defaultProducts,
        ...vendorProducts
    ];

}


/* =========================================================
   DISPLAY PRODUCTS
========================================================= */

function renderProducts() {

    if (!productGrid) {
        return;
    }

    const products =
        getAllProducts();

    productGrid.innerHTML = "";

    products.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "product-card";

        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/800x600?text=ShopNova'"
            >

            <div class="product-card-content">

                <span class="home-product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>

                <button
                    class="primary-btn add-cart-btn"
                    type="button"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>
        `;

        productGrid.appendChild(card);

    });

}


/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(".add-cart-btn");

        if (!button) {
            return;
        }

        const id =
            Number(button.dataset.id);

        addToCart(id);

    }
);


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(id) {

    const product =
        getAllProducts().find(
            item => Number(item.id) === id
        );

    if (!product) {
        return;
    }

    const existing =
        cart.find(
            item => Number(item.id) === id
        );

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    saveCart();

    renderCart();

    showMessage(
        `${product.name} added to cart`
    );

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "shopnovaCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="cart-empty">

                <div>
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to your cart to see them here.
                </p>

            </div>

        `;

        updateCartTotals();

        return;

    }


    cart.forEach(item => {

        const card =
            document.createElement("div");

        card.className =
            "cart-item";

        const subtotal =
            Number(item.price) *
            Number(item.quantity);

        card.innerHTML = `

            <img
                src="${item.image}"
                alt="${escapeHTML(item.name)}"
                onerror="this.src='https://via.placeholder.com/200x200?text=ShopNova'"
            >

            <div class="cart-item-info">

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    ${escapeHTML(item.category)}
                </p>

                <p>
                    Quantity:
                    ${item.quantity}
                </p>

                <div class="cart-item-price">
                    ${formatPrice(subtotal)}
                </div>

            </div>

            <button
                class="cart-remove"
                type="button"
                data-cart-id="${item.id}"
            >
                Remove
            </button>

        `;

        cartItemsContainer.appendChild(card);

    });

    updateCartTotals();

}


/* =========================================================
   REMOVE CART ITEM
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(".cart-remove");

        if (!button) {
            return;
        }

        const id =
            Number(button.dataset.cartId);

        cart =
            cart.filter(
                item => Number(item.id) !== id
            );

        saveCart();

        renderCart();

        showMessage("Product removed from cart");

    }
);


/* =========================================================
   CART TOTALS
========================================================= */

function updateCartTotals() {

    const itemCount =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                Number(item.price) *
                Number(item.quantity),
            0
        );


    if (cartCount) {

        cartCount.textContent =
            itemCount;

    }

    if (summaryItems) {

        summaryItems.textContent =
            itemCount;

    }

    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(total);

    }

}


/* =========================================================
   SEARCH
========================================================= */

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            performSearch(
                searchInput.value.trim()
            );

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const value =
                searchInput.value.trim();

            if (value.length >= 2) {

                performSearch(value);

            }

            if (value.length === 0) {

                hideSearchResults();

            }

        }
    );

}


/* =========================================================
   SEARCH FUNCTION
========================================================= */

function performSearch(query) {

    if (!homeSearchResults) {
        return;
    }

    const products =
        getAllProducts();

    const search =
        query.toLowerCase();

    const results =
        products.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                product.category
                    .toLowerCase()
                    .includes(search)

                ||

                product.description
                    .toLowerCase()
                    .includes(search)

            );

        });


    homeSearchResults.style.display =
        "block";


    if (searchResultText) {

        searchResultText.textContent =
            `${results.length} product(s) found for "${query}"`;

    }


    homeProductGrid.innerHTML = "";


    if (results.length === 0) {

        homeNoResults.style.display =
            "block";

        return;

    }


    homeNoResults.style.display =
        "none";


    results.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "home-product-card";

        card.innerHTML = `

            <div class="home-product-card-inner">


                <div class="home-product-front">

                    <img
                        class="home-product-image"
                        src="${product.image}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.src='https://via.placeholder.com/800x600?text=ShopNova'"
                    >

                    <div class="home-product-info">

                        <span class="home-product-category">
                            ${escapeHTML(product.category)}
                        </span>

                        <h3>
                            ${escapeHTML(product.name)}
                        </h3>

                        <div class="home-product-price">
                            ${formatPrice(product.price)}
                        </div>

                        <div class="home-product-hint">
                            Click card to view details →
                        </div>

                    </div>

                </div>


                <div class="home-product-back">

                    <div class="back-icon">
                        🛍️
                    </div>

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <div class="back-category">
                        ${escapeHTML(product.category)}
                    </div>

                    <div class="back-price">
                        ${formatPrice(product.price)}
                    </div>

                    <p>
                        ${escapeHTML(product.description)}
                    </p>

                    <button
                        class="back-action add-cart-btn"
                        type="button"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>


            </div>

        `;


        card.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.closest(
                        ".add-cart-btn"
                    )
                ) {
                    return;
                }

                card.classList.toggle("flipped");

            }
        );


        homeProductGrid.appendChild(card);

    });

}


/* =========================================================
   HIDE SEARCH
========================================================= */

function hideSearchResults() {

    if (!homeSearchResults) {
        return;
    }

    homeSearchResults.style.display =
        "none";

}


/* =========================================================
   VENDOR IMAGE PREVIEW
========================================================= */

if (productImage) {

    productImage.addEventListener(
        "change",
        function() {

            const file =
                productImage.files[0];

            if (!file) {

                imagePreview.innerHTML =
                    "<span>Product image preview</span>";

                return;

            }


            if (!file.type.startsWith("image/")) {

                showMessage(
                    "Please select an image file"
                );

                productImage.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    imagePreview.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="Product Preview"
                        >

                    `;

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   VENDOR FORM
========================================================= */

if (vendorForm) {

    vendorForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("productName")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("productCategory")
                    .value;


            const price =
                Number(
                    document
                        .getElementById("productPrice")
                        .value
                );


            const originalPrice =
                Number(
                    document
                        .getElementById(
                            "productOriginalPrice"
                        )
                        .value
                ) || 0;


            const description =
                document
                    .getElementById(
                        "productDescription"
                    )
                    .value
                    .trim();


            const location =
                document
                    .getElementById(
                        "vendorLocation"
                    )
                    .value
                    .trim();


            if (!name || !category || !price) {

                showMessage(
                    "Please complete the required fields"
                );

                return;

            }


            const file =
                productImage &&
                productImage.files[0];


            const saveProduct =
                function(image) {

                    const product = {

                        id:
                            Date.now(),

                        name,

                        category,

                        price,

                        originalPrice,

                        description:
                            description ||
                            "Quality product from ShopNova vendor.",

                        location,

                        image:
                            image ||
                            "https://via.placeholder.com/800x600?text=ShopNova"

                    };


                    vendorProducts.push(product);


                    localStorage.setItem(
                        "shopnovaVendorProducts",
                        JSON.stringify(
                            vendorProducts
                        )
                    );


                    renderProducts();

                    renderVendorProducts();


                    vendorForm.reset();


                    if (imagePreview) {

                        imagePreview.innerHTML =
                            "<span>Product image preview</span>";

                    }


                    showMessage(
                        "Product added successfully!"
                    );

                };


            if (file) {

                const reader =
                    new FileReader();


                reader.onload =
                    function(event) {

                        saveProduct(
                            event.target.result
                        );

                    };


                reader.readAsDataURL(file);

            } else {

                saveProduct();

            }

        }
    );

}


/* =========================================================
   RENDER VENDOR PRODUCTS
========================================================= */

function renderVendorProducts() {

    if (!vendorProductsContainer) {
        return;
    }

    vendorProductsContainer.innerHTML = "";


    if (vendorProducts.length === 0) {

        vendorProductsContainer.innerHTML = `

            <div class="vendor-empty">

                <h3>
                    No vendor products yet
                </h3>

                <p>
                    Add your first product using the form above.
                </p>

            </div>

        `;

        return;

    }


    vendorProducts.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "vendor-product-card";


        let discount = "";


        if (
            product.originalPrice &&
            product.originalPrice > product.price
        ) {

            discount =
                Math.round(
                    (
                        (
                            product.originalPrice -
                            product.price
                        )
                        /
                        product.originalPrice
                    ) * 100
                );

        }


        card.innerHTML = `

            <div class="vendor-product-image">

                <img
                    src="${product.image}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.src='https://via.placeholder.com/800x600?text=ShopNova'"
                >

            </div>


            <div class="vendor-product-info">

                <span class="vendor-product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                ${
                    product.location
                    ?
                    `<p>📍 ${escapeHTML(product.location)}</p>`
                    :
                    ""
                }


                <div class="vendor-product-price">

                    <strong>
                        ${formatPrice(product.price)}
                    </strong>

                    ${
                        product.originalPrice
                        ?
                        `<del>${formatPrice(product.originalPrice)}</del>`
                        :
                        ""
                    }

                    ${
                        discount
                        ?
                        `<span>${discount}% OFF</span>`
                        :
                        ""
                    }

                </div>


                <button
                    type="button"
                    class="delete-vendor-product"
                    data-vendor-id="${product.id}"
                >
                    Delete Product
                </button>

            </div>

        `;


        vendorProductsContainer.appendChild(card);

    });

}


/* =========================================================
   DELETE VENDOR PRODUCT
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".delete-vendor-product"
            );

        if (!button) {
            return;
        }


        const id =
            Number(
                button.dataset.vendorId
            );


        vendorProducts =
            vendorProducts.filter(
                product =>
                    Number(product.id) !== id
            );


        localStorage.setItem(
            "shopnovaVendorProducts",
            JSON.stringify(
                vendorProducts
            )
        );


        renderVendorProducts();

        renderProducts();

        showMessage(
            "Vendor product deleted"
        );

    }
);


/* =========================================================
   GPS LOCATION
========================================================= */

if (locationBtn) {

    locationBtn.addEventListener(
        "click",
        function() {

            if (!navigator.geolocation) {

                showMessage(
                    "Geolocation is not supported by this browser."
                );

                return;

            }


            locationBtn.disabled =
                true;

            locationBtn.textContent =
                "Getting location...";


            navigator.geolocation.getCurrentPosition(

                function(position) {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;


                    const locationInput =
                        document.getElementById(
                            "vendorLocation"
                        );


                    if (locationInput) {

                        locationInput.value =
                            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

                    }


                    locationBtn.disabled =
                        false;

                    locationBtn.textContent =
                        "📍 Get Location";


                    showMessage(
                        "Location detected"
                    );

                },


                function() {

                    locationBtn.disabled =
                        false;

                    locationBtn.textContent =
                        "📍 Get Location";


                    showMessage(
                        "Unable to get your location."
                    );

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }

            );

        }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        function() {

            mainNavigation.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING LINK
========================================================= */

if (mainNavigation) {

    mainNavigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                function() {

                    mainNavigation.classList.remove(
                        "active"
                    );

                }
            );

        });

}


/* =========================================================
   CONTACT FORM
========================================================= */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const name =
                document
                    .getElementById(
                        "contactName"
                    )
                    .value
                    .trim();


            showMessage(
                `Thanks ${name || "there"}! Your message has been received.`
            );


            contactForm.reset();

        }
    );

}


/* =========================================================
   CHECKOUT
========================================================= */

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                showMessage(
                    "Your cart is empty."
                );

                return;

            }


            showMessage(
                "Checkout page coming soon."
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
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
   INITIALIZE
========================================================= */

renderProducts();

renderVendorProducts();

renderCart();

updateCartTotals();