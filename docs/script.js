/* =====================================================
   SHOPNOVA - COMPLETE SCRIPT
   Search + Cart Count + Add To Cart + Mobile Menu
   ===================================================== */


/* =====================================================
   CART
   ===================================================== */

function getCart() {
    try {
        return JSON.parse(
            localStorage.getItem("shopnova_cart")
        ) || [];
    } catch (error) {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        "shopnova_cart",
        JSON.stringify(cart)
    );
}


/* =====================================================
   CART COUNT
   ===================================================== */

function updateCartCount() {

    const cart = getCart();

    let count = 0;

    cart.forEach(function (item) {

        count += Number(item.quantity) || 1;

    });


    const cartCount =
        document.getElementById("cartCount");

    const homeCartCount =
        document.getElementById("cart-count");

    const mobileCartCount =
        document.getElementById("mobile-cart-count");


    if (cartCount) {
        cartCount.textContent = count;
    }

    if (homeCartCount) {
        homeCartCount.textContent = count;
    }

    if (mobileCartCount) {
        mobileCartCount.textContent = count;
    }
}


/* =====================================================
   ADD TO CART
   ===================================================== */

function addToCart(
    name,
    price,
    image,
    button
) {

    let cart = getCart();


    const existingProduct =
        cart.find(function (item) {

            return item.name === name;

        });


    if (existingProduct) {

        existingProduct.quantity =
            (Number(existingProduct.quantity) || 1) + 1;

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


    if (button) {

        const originalText =
            button.innerHTML;

        button.innerHTML =
            "✓ Added to Cart";

        button.classList.add("added");


        setTimeout(function () {

            button.innerHTML =
                originalText;

            button.classList.remove("added");

        }, 1400);

    }

}


/* =====================================================
   SEARCH FUNCTION
   ===================================================== */

function searchProducts() {

    const input =
        document.getElementById("searchInput");

    const productsGrid =
        document.getElementById("productsGrid");


    if (!input || !productsGrid) {
        return;
    }


    const searchText =
        input.value
            .trim()
            .toLowerCase();


    const products =
        productsGrid.querySelectorAll(
            ".product-card"
        );

    const noResults =
        document.getElementById("noResults");

    const searchResult =
        document.getElementById("searchResult");


    let visibleProducts = 0;


    products.forEach(function (product) {

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


        const productNameElement =
            product.querySelector(
                ".product-name"
            );


        const descriptionElement =
            product.querySelector(
                ".product-description"
            );


        const productName =
            productNameElement
                ? productNameElement.textContent.toLowerCase()
                : "";


        const description =
            descriptionElement
                ? descriptionElement.textContent.toLowerCase()
                : "";


        const searchableText =
            name +
            " " +
            category +
            " " +
            productName +
            " " +
            description;


        if (
            searchText === "" ||
            searchableText.includes(searchText)
        ) {

            product.style.display = "";

            visibleProducts++;

        } else {

            product.style.display = "none";

        }

    });


    /* =========================
       SEARCH MESSAGE
    ========================= */

    if (searchText !== "") {

        if (searchResult) {

            searchResult.style.display =
                "block";

            searchResult.textContent =
                visibleProducts +
                " product" +
                (visibleProducts === 1 ? "" : "s") +
                " found for \"" +
                input.value.trim() +
                "\"";

        }

    } else {

        if (searchResult) {

            searchResult.style.display =
                "none";

        }

    }


    /* =========================
       NO RESULTS
    ========================= */

    if (noResults) {

        if (
            searchText !== "" &&
            visibleProducts === 0
        ) {

            noResults.style.display =
                "block";

        } else {

            noResults.style.display =
                "none";

        }

    }

}


/* =====================================================
   SEARCH BUTTON
   ===================================================== */

const searchButton =
    document.getElementById(
        "searchBtn"
    );


if (searchButton) {

    searchButton.addEventListener(
        "click",
        function () {

            searchProducts();

        }
    );

}


/* =====================================================
   SEARCH ENTER KEY
   ===================================================== */

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchProducts();

            }

        }
    );


    /*
       Live search while typing
    */

    searchInput.addEventListener(
        "input",
        function () {

            searchProducts();

        }
    );

}


/* =====================================================
   HOME PAGE SEARCH
   ===================================================== */

function setupHomeSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const button =
        document.getElementById(
            "searchButton"
        );


    if (!input) {
        return;
    }


    function goToProducts() {

        const text =
            input.value.trim();


        if (text === "") {

            window.location.href =
                "products.html";

            return;

        }


        window.location.href =
            "products.html?search=" +
            encodeURIComponent(text);

    }


    if (button) {

        button.addEventListener(
            "click",
            goToProducts
        );

    }


    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                goToProducts();

            }

        }
    );

}


/* =====================================================
   READ SEARCH FROM URL
   ===================================================== */

function loadSearchFromURL() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const productsGrid =
        document.getElementById(
            "productsGrid"
        );


    /*
       Only run this part on Products page.
    */

    if (!input || !productsGrid) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const search =
        params.get("search");


    if (search) {

        input.value =
            search;

        searchProducts();

    }

}


/* =====================================================
   MOBILE MENU
   ===================================================== */

const menuButton =
    document.getElementById(
        "menuButton"
    );


const mobileNavigation =
    document.getElementById(
        "mobileNavigation"
    );


if (
    menuButton &&
    mobileNavigation
) {

    menuButton.addEventListener(
        "click",
        function () {

            mobileNavigation.classList.toggle(
                "show"
            );

        }
    );

}


/* =====================================================
   STORAGE UPDATE
   ===================================================== */

window.addEventListener(
    "storage",
    function () {

        updateCartCount();

    }
);


/* =====================================================
   INITIALIZE
   ===================================================== */

updateCartCount();

setupHomeSearch();

loadSearchFromURL();