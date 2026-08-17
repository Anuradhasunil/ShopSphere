/* =========================================================
   SHOPNOVA - COMPLETE SCRIPT.JS
   ========================================================= */


/* =========================================================
   PRODUCT DATA
   ========================================================= */

const products = [

    {
        id: 1,
        name: "Premium Bag",
        category: "Fashion",
        price: 1499,
        oldPrice: 2199,
        image: "images/bag.jpg"
    },

    {
        id: 2,
        name: "Wireless Earbuds",
        category: "Technology",
        price: 1999,
        oldPrice: 3499,
        image: "images/earbuds.jpg"
    },

    {
        id: 3,
        name: "Luxury Loungewear",
        category: "Lifestyle",
        price: 1299,
        oldPrice: 1899,
        image: "images/loungewear.jpg"
    },

    {
        id: 4,
        name: "Beauty Collection",
        category: "Beauty",
        price: 999,
        oldPrice: 1599,
        image: "images/makeup.jpg"
    },

    {
        id: 5,
        name: "Men's Shoes",
        category: "Footwear",
        price: 2499,
        oldPrice: 3999,
        image: "images/mens-shoes.jpg"
    },

    {
        id: 6,
        name: "Luxury Perfume",
        category: "Fragrance",
        price: 1799,
        oldPrice: 2699,
        image: "images/perfume.jpg"
    },

    {
        id: 7,
        name: "Formal Suit",
        category: "Fashion",
        price: 4999,
        oldPrice: 7499,
        image: "images/suit.jpg"
    },

    {
        id: 8,
        name: "Premium Sunglasses",
        category: "Accessories",
        price: 1599,
        oldPrice: 2499,
        image: "images/sunglasses.jpg"
    },

    {
        id: 9,
        name: "Supercar Key",
        category: "Luxury",
        price: 2999,
        oldPrice: 4499,
        image: "images/supercar-key.jpg"
    },

    {
        id: 10,
        name: "Luxury Collection",
        category: "Premium",
        price: 5499,
        oldPrice: 7999,
        image: "images/luxury-banner.jpg"
    },

    {
        id: 11,
        name: "Premium Watch",
        category: "Technology",
        price: 2999,
        oldPrice: 4999,
        image: "images/watch.jpg"
    },

    /*
       =====================================================
       NEW PRODUCT SLOT

       Change only these values when you add your new image.

       Example:
       image: "images/my-new-product.jpg"

       Put that image inside:

       docs/images/
       =====================================================
    */

    {
        id: 12,
        name: "New Product",
        category: "New Collection",
        price: 999,
        oldPrice: 1499,
        image: "images/new-product.jpg",
        newProduct: true
    }

];



/* =========================================================
   GET CART
   ========================================================= */

function getCart() {

    let cart = [];

    try {

        cart = JSON.parse(
            localStorage.getItem("shopnova_cart") || "[]"
        );

    } catch (error) {

        cart = [];

    }

    if (!Array.isArray(cart)) {

        cart = [];

    }

    return cart;
}



/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart(cart) {

    localStorage.setItem(
        "shopnova_cart",
        JSON.stringify(cart)
    );

}



/* =========================================================
   UPDATE CART COUNT
   ========================================================= */

function updateCartCount() {

    const cart = getCart();

    let totalItems = 0;

    cart.forEach(function (item) {

        totalItems += Number(item.quantity || 1);

    });


    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        cartCount.textContent = totalItems;

    }

}



/* =========================================================
   ADD PRODUCT TO CART
   ========================================================= */

function addToCart(productId) {

    const product = products.find(function (item) {

        return Number(item.id) === Number(productId);

    });


    if (!product) {

        console.error(
            "Product not found:",
            productId
        );

        return;

    }


    const cart = getCart();


    const existingProduct =
        cart.find(function (item) {

            return Number(item.id) === Number(product.id);

        });


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

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

    updateCartCount();


    alert(
        product.name +
        " added to cart!"
    );

}



/* =========================================================
   DISPLAY PRODUCTS
   ========================================================= */

function displayProducts(productList) {

    const grid =
        document.getElementById("productsGrid");


    if (!grid) {

        return;

    }


    /*
       VERY IMPORTANT:

       Clear the grid before adding products.

       This prevents the same product from appearing twice.
    */

    grid.innerHTML = "";


    if (
        !productList ||
        productList.length === 0
    ) {

        grid.innerHTML = `

            <div class="no-products">

                <div class="no-products-icon">
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


    productList.forEach(function (product) {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        if (product.newProduct) {

            card.classList.add(
                "new-product-card"
            );

        }


        const newBadge =
            product.newProduct
                ? `<div class="new-badge">NEW</div>`
                : "";


        card.innerHTML = `

            <div class="product-image-wrap">

                ${newBadge}

                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='images/luxury-banner.jpg';
                    "
                >

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>


                <h2 class="product-name">
                    ${product.name}
                </h2>


                <div class="price-row">

                    <span class="product-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <span class="old-price">
                        ₹${product.oldPrice.toLocaleString("en-IN")}
                    </span>

                </div>


                <button
                    type="button"
                    class="add-cart-btn"
                    data-product-id="${product.id}"
                >
                    🛒 Add to Cart
                </button>

            </div>

        `;


        grid.appendChild(card);

    });


    /*
       Attach Add to Cart buttons after rendering.
    */

    const buttons =
        grid.querySelectorAll(
            ".add-cart-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const id =
                    this.getAttribute(
                        "data-product-id"
                    );

                addToCart(id);

            }
        );

    });

}



/* =========================================================
   SEARCH PRODUCTS
   ========================================================= */

function searchProducts() {

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

        displayProducts(products);

        return;

    }


    const filteredProducts =
        products.filter(function (product) {

            const productName =
                product.name.toLowerCase();

            const productCategory =
                product.category.toLowerCase();


            return (
                productName.includes(query) ||
                productCategory.includes(query)
            );

        });


    displayProducts(
        filteredProducts
    );

}



/* =========================================================
   SEARCH BUTTON
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const searchButton =
        document.getElementById(
            "searchButton"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchProducts
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    searchProducts();

                }

            }
        );


        searchInput.addEventListener(
            "input",
            function () {

                /*
                   Live search.
                   Remove this section if you only
                   want search after pressing the button.
                */

                searchProducts();

            }
        );

    }

}



/* =========================================================
   CONTACT POPUP
   ========================================================= */

function setupContact() {

    const contactButton =
        document.getElementById(
            "contactButton"
        );


    const contactPopup =
        document.getElementById(
            "contactPopup"
        );


    const closeContact =
        document.getElementById(
            "closeContact"
        );


    if (
        !contactButton ||
        !contactPopup
    ) {

        return;

    }


    contactButton.addEventListener(
        "click",
        function () {

            contactPopup.classList.add(
                "show"
            );

        }
    );


    if (closeContact) {

        closeContact.addEventListener(
            "click",
            function () {

                contactPopup.classList.remove(
                    "show"
                );

            }
        );

    }


    contactPopup.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                contactPopup
            ) {

                contactPopup.classList.remove(
                    "show"
                );

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                contactPopup.classList.remove(
                    "show"
                );

            }

        }
    );

}



/* =========================================================
   INITIALIZE PRODUCTS PAGE
   ========================================================= */

function initializeProductsPage() {

    /*
       Only render if productsGrid exists.
       This means script.js can safely be used
       on other pages too.
    */

    const grid =
        document.getElementById(
            "productsGrid"
        );


    if (grid) {

        displayProducts(products);

    }


    updateCartCount();

    setupSearch();

    setupContact();

}



/* =========================================================
   UPDATE CART COUNT WHEN STORAGE CHANGES
   ========================================================= */

window.addEventListener(
    "storage",
    function () {

        updateCartCount();

    }
);



/* =========================================================
   PAGE LOAD
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeProductsPage
    );

} else {

    initializeProductsPage();

}



/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO OTHER PAGES
   ========================================================= */

window.ShopNova = {

    products: products,

    getCart: getCart,

    saveCart: saveCart,

    addToCart: addToCart,

    updateCartCount: updateCartCount,

    displayProducts: displayProducts,

    searchProducts: searchProducts

};