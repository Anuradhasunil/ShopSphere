/* =========================================================
   SHOPNOVA - PRODUCTS + CART SYSTEM
   ========================================================= */


/* =========================================================
   PRODUCT DATABASE
   ========================================================= */

const products = [

    {
        id: 1,
        name: "Premium Laptop",
        category: "Electronics",
        price: 54999,
        oldPrice: 64999,
        image: "images/laptop.jpg"
    },

    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2999,
        oldPrice: 3999,
        image: "images/watch.jpg"
    },

    {
        id: 3,
        name: "Wireless Earbuds",
        category: "Electronics",
        price: 1999,
        oldPrice: 2999,
        image: "images/earbuds.jpg"
    },

    {
        id: 4,
        name: "Luxury Perfume",
        category: "Beauty",
        price: 2499,
        oldPrice: 3499,
        image: "images/perfume.jpg"
    },

    {
        id: 5,
        name: "Women's Loungewear",
        category: "Fashion",
        price: 1799,
        oldPrice: 2499,
        image: "images/loungewear.jpg"
    },

    {
        id: 6,
        name: "Premium Handbag",
        category: "Accessories",
        price: 2999,
        oldPrice: 3999,
        image: "images/bag.jpg"
    },

    {
        id: 7,
        name: "Men's Sports Shoes",
        category: "Footwear",
        price: 1499,
        oldPrice: 2199,
        image: "images/mens-shoes.jpg"
    },

    {
        id: 8,
        name: "Luxury Sunglasses",
        category: "Accessories",
        price: 2499,
        oldPrice: 3499,
        image: "images/sunglasses.jpg"
    },

    {
        id: 9,
        name: "Women's Makeup Collection",
        category: "Beauty",
        price: 1999,
        oldPrice: 2999,
        image: "images/makeup.jpg"
    },

    {
        id: 10,
        name: "Men's Corporate Business Suit",
        category: "Apparel",
        price: 3499,
        oldPrice: 5499,
        image: "images/suit.jpg"
    },

    {
        id: 11,
        name: "Luxury Supercar Key",
        category: "Luxury",
        price: 4999,
        oldPrice: 6999,
        image: "images/supercar-key.jpg"
    },

    {
        id: 12,
        name: "Luxury Collection",
        category: "Luxury",
        price: 3999,
        oldPrice: 5999,
        image: "images/luxury-banner.jpg"
    },

    /* =========================================
       MISSING PRODUCT #1
       ========================================= */

    {
        id: 13,
        name: "Bible Wonders Book",
        category: "Books",
        price: 799,
        oldPrice: 999,
        image: "images/bible-wonders.jpg"
    },

    /* =========================================
       MISSING PRODUCT #2
       ========================================= */

    {
        id: 14,
        name: "Premium Casual Shirt",
        category: "Apparel",
        price: 799,
        oldPrice: 1199,
        image: "images/casual-shirt.jpg"
    }

];


/* =========================================================
   CART
   ========================================================= */

const CART_KEY = "shopnova_cart";


function getCart() {

    try {

        const savedCart = localStorage.getItem(CART_KEY);

        if (!savedCart) {
            return [];
        }

        const cart = JSON.parse(savedCart);

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart;

    } catch (error) {

        console.error(
            "Unable to read ShopNova cart:",
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

    updateCartCount();
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

    const cart = getCart();

    let totalItems = 0;

    cart.forEach(item => {

        const quantity =
            Number(item.quantity) || 1;

        totalItems += quantity;

    });

    cartCount.textContent = totalItems;
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productId) {

    const product =
        products.find(
            item => Number(item.id) === Number(productId)
        );

    if (!product) {

        console.error(
            "Product not found:",
            productId
        );

        return;
    }


    const cart = getCart();


    const existingProduct =
        cart.find(
            item => Number(item.id) === Number(productId)
        );


    if (existingProduct) {

        existingProduct.quantity =
            (Number(existingProduct.quantity) || 1) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            price: product.price,

            oldPrice: product.oldPrice,

            image: product.image,

            quantity: 1

        });

    }


    saveCart(cart);


    showAddedMessage(product.name);
}


/* =========================================================
   ADDED MESSAGE
   ========================================================= */

function showAddedMessage(productName) {

    const existingMessage =
        document.querySelector(".shopnova-added-message");

    if (existingMessage) {
        existingMessage.remove();
    }


    const message =
        document.createElement("div");

    message.className =
        "shopnova-added-message";


    message.textContent =
        "✓ " + productName + " added to cart";


    message.style.position = "fixed";
    message.style.right = "20px";
    message.style.bottom = "20px";
    message.style.zIndex = "999999";
    message.style.background = "#0872d1";
    message.style.color = "#ffffff";
    message.style.padding = "13px 18px";
    message.style.borderRadius = "8px";
    message.style.fontSize = "14px";
    message.style.fontWeight = "700";
    message.style.boxShadow =
        "0 8px 25px rgba(0,0,0,.18)";


    document.body.appendChild(message);


    setTimeout(() => {

        message.style.opacity = "0";

        message.style.transition =
            "opacity .3s ease";

        setTimeout(() => {

            message.remove();

        }, 300);

    }, 1800);
}


/* =========================================================
   PRODUCT IMAGE FALLBACK
   ========================================================= */

function createProductImage(product) {

    const img =
        document.createElement("img");

    img.src = product.image;

    img.alt = product.name;

    img.loading = "lazy";


    img.onerror = function () {

        /*
          Important:
          We do NOT remove the product card if
          an image file is missing.
        */

        this.onerror = null;

        this.src =
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="600"
                     height="500"
                     viewBox="0 0 600 500">

                    <rect
                        width="600"
                        height="500"
                        fill="#f1f5f9"/>

                    <text
                        x="300"
                        y="245"
                        text-anchor="middle"
                        font-family="Arial"
                        font-size="28"
                        fill="#64748b">
                        ${product.name}
                    </text>

                    <text
                        x="300"
                        y="285"
                        text-anchor="middle"
                        font-family="Arial"
                        font-size="18"
                        fill="#94a3b8">
                        ShopNova
                    </text>

                </svg>
            `);
    };


    return img;
}


/* =========================================================
   CREATE PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const card =
        document.createElement("article");

    card.className =
        "product-card";


    /* IMAGE */

    const imageBox =
        document.createElement("div");

    imageBox.className =
        "product-image-box";


    const image =
        createProductImage(product);


    imageBox.appendChild(image);


    /* INFO */

    const info =
        document.createElement("div");

    info.className =
        "product-info";


    /* CATEGORY */

    const category =
        document.createElement("div");

    category.className =
        "product-category";

    category.textContent =
        product.category;


    /* NAME */

    const name =
        document.createElement("div");

    name.className =
        "product-name";

    name.textContent =
        product.name;


    /* PRICE */

    const price =
        document.createElement("div");

    price.className =
        "product-price";


    const currentPrice =
        document.createElement("span");

    currentPrice.className =
        "current-price";

    currentPrice.textContent =
        "₹" +
        Number(product.price).toLocaleString("en-IN");


    price.appendChild(currentPrice);


    if (product.oldPrice) {

        const oldPrice =
            document.createElement("span");

        oldPrice.className =
            "old-price";

        oldPrice.textContent =
            "₹" +
            Number(product.oldPrice)
                .toLocaleString("en-IN");


        price.appendChild(oldPrice);
    }


    /* ADD BUTTON */

    const button =
        document.createElement("button");

    button.className =
        "add-cart-button";

    button.type =
        "button";

    button.innerHTML =
        "🛒 Add to Cart";


    button.addEventListener(
        "click",
        function () {

            addToCart(product.id);

        }
    );


    /* BUILD */

    info.appendChild(category);

    info.appendChild(name);

    info.appendChild(price);

    info.appendChild(button);


    card.appendChild(imageBox);

    card.appendChild(info);


    return card;
}


/* =========================================================
   DISPLAY PRODUCTS
   ========================================================= */

function displayProducts(productList) {

    const grid =
        document.getElementById("productGrid");


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (
        !productList ||
        productList.length === 0
    ) {

        const noResults =
            document.createElement("div");

        noResults.className =
            "no-results";

        noResults.textContent =
            "No products found.";

        grid.appendChild(noResults);

        return;
    }


    productList.forEach(product => {

        const card =
            createProductCard(product);

        grid.appendChild(card);

    });
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById("productSearch");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchText =
                this.value
                    .trim()
                    .toLowerCase();


            if (!searchText) {

                displayProducts(products);

                return;
            }


            const filteredProducts =
                products.filter(product => {

                    const name =
                        product.name.toLowerCase();

                    const category =
                        product.category.toLowerCase();


                    return (
                        name.includes(searchText) ||
                        category.includes(searchText)
                    );

                });


            displayProducts(
                filteredProducts
            );

        }
    );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayProducts(products);

        updateCartCount();

        setupSearch();

    }
);