/* =====================================================
   SHOPNOVA HOME JAVASCRIPT
   ===================================================== */


/* =====================================================
   CART COUNT
   ===================================================== */

function updateCartCount() {

    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem("shopnova_cart")
            ) || [];

    } catch (error) {

        cart = [];

    }


    let count = 0;


    if (Array.isArray(cart)) {

        cart.forEach(function (item) {

            count +=
                Number(item.quantity) || 1;

        });

    }


    const cartCount =
        document.getElementById("cart-count");

    const mobileCartCount =
        document.getElementById(
            "mobile-cart-count"
        );


    if (cartCount) {
        cartCount.textContent = count;
    }


    if (mobileCartCount) {
        mobileCartCount.textContent = count;
    }

}


/* =====================================================
   SEARCH
   ===================================================== */

function performSearch() {

    const input =
        document.getElementById("searchInput");

    if (!input) {
        return;
    }


    const searchTerm =
        input.value.trim();


    if (searchTerm === "") {

        window.location.href =
            "products.html";

        return;

    }


    window.location.href =
        "products.html?search=" +
        encodeURIComponent(searchTerm);

}


/* =====================================================
   SEARCH BUTTON
   ===================================================== */

const searchButton =
    document.getElementById(
        "searchButton"
    );


if (searchButton) {

    searchButton.addEventListener(
        "click",
        performSearch
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

                performSearch();

            }

        }
    );

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
   CLOSE MOBILE MENU AFTER CLICK
   ===================================================== */

if (mobileNavigation) {

    const mobileLinks =
        mobileNavigation.querySelectorAll("a");


    mobileLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileNavigation.classList.remove(
                        "show"
                    );

                }
            );

        }
    );

}


/* =====================================================
   UPDATE CART
   ===================================================== */

updateCartCount();


/* =====================================================
   UPDATE WHEN STORAGE CHANGES
   ===================================================== */

window.addEventListener(
    "storage",
    updateCartCount
);