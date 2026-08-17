/* =========================================================
   SHOPNOVA MAIN JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   CART STORAGE
========================================================= */

const CART_KEY = "shopnova_cart";


function getCart(){

    try{

        const cart =
            JSON.parse(
                localStorage.getItem(CART_KEY)
            );

        return Array.isArray(cart) ? cart : [];

    }catch(error){

        return [];

    }

}


function saveCart(cart){

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount(){

    const cart = getCart();

    let totalQuantity = 0;

    cart.forEach(item => {

        totalQuantity +=
            Number(item.quantity) || 0;

    });


    document
        .querySelectorAll(".cart-count")
        .forEach(element => {

            element.textContent =
                totalQuantity;

        });

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(name, price, image){

    const cart = getCart();


    const existing =
        cart.find(
            item => item.name === name
        );


    if(existing){

        existing.quantity =
            (Number(existing.quantity) || 0) + 1;

    }else{

        cart.push({

            name:name,

            price:Number(price),

            image:image,

            quantity:1

        });

    }


    saveCart(cart);


    showAddedMessage(name);

}


/* =========================================================
   OLD FUNCTION SUPPORT
   Keeps existing onclick="add(...)"
   working if any old page remains.
========================================================= */

function add(name, price, image){

    addToCart(
        name,
        price,
        image
    );

}


/* =========================================================
   ADD MESSAGE
========================================================= */

function showAddedMessage(name){

    const message =
        document.createElement("div");


    message.textContent =
        name + " added to cart";


    message.style.position =
        "fixed";

    message.style.right =
        "20px";

    message.style.bottom =
        "20px";

    message.style.zIndex =
        "50000";

    message.style.padding =
        "13px 18px";

    message.style.borderRadius =
        "9px";

    message.style.background =
        "#159957";

    message.style.color =
        "#ffffff";

    message.style.fontSize =
        "12px";

    message.style.fontWeight =
        "800";

    message.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.18)";


    document.body.appendChild(message);


    setTimeout(() => {

        message.style.opacity =
            "0";

        message.style.transition =
            ".3s";

        setTimeout(() => {

            message.remove();

        },300);

    },1500);

}


/* =========================================================
   UPDATE QUANTITY
========================================================= */

function changeQuantity(index, amount){

    const cart = getCart();


    if(!cart[index]){

        return;

    }


    cart[index].quantity =
        (Number(cart[index].quantity) || 1)
        + amount;


    if(cart[index].quantity <= 0){

        cart.splice(index,1);

    }


    saveCart(cart);


    renderCartPage();

}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeFromCart(index){

    const cart = getCart();


    if(!cart[index]){

        return;

    }


    cart.splice(index,1);


    saveCart(cart);


    renderCartPage();

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal(){

    const cart = getCart();

    return cart.reduce(

        (total,item) => {

            return total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                );

        },

        0

    );

}


/* =========================================================
   CURRENCY
========================================================= */

function formatPrice(value){

    return "₹" +
        Number(value || 0)
            .toLocaleString("en-IN");

}


/* =========================================================
   CART PAGE
========================================================= */

function renderCartPage(){

    const container =
        document.getElementById(
            "cartContent"
        );


    if(!container){

        return;

    }


    const cart = getCart();


    if(cart.length === 0){

        container.innerHTML = `

            <div class="cart-card">

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        🛒
                    </div>

                    <h2>Your Cart is Empty</h2>

                    <p>
                        Add some products to
                        get started.
                    </p>

                    <a href="products.html">
                        Continue Shopping
                    </a>

                </div>

            </div>

        `;

        return;

    }


    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            Number(item.price) *
            Number(item.quantity);

    });


    let itemsHtml = "";


    cart.forEach((item,index) => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        itemsHtml += `

            <div class="cart-item">

                <div class="product-info">

                    <img
                        src="${item.image}"
                        alt="${escapeHTML(item.name)}"
                        onerror="this.style.display='none'"
                    >

                    <div>

                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>

                        <small>
                            ShopNova Premium Collection
                        </small>

                    </div>

                </div>


                <div class="price">
                    ${formatPrice(item.price)}
                </div>


                <div class="quantity">

                    <button
                        onclick="changeQuantity(${index},-1)">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${index},1)">
                        +
                    </button>

                </div>


                <div class="price">
                    ${formatPrice(itemTotal)}
                </div>


                <button
                    class="remove"
                    onclick="removeFromCart(${index})"
                    title="Remove">

                    ×

                </button>

            </div>

        `;

    });


    container.innerHTML = `

        <div class="cart-layout">


            <div class="cart-card">

                <div class="cart-head">

                    <span>Product</span>
                    <span>Price</span>
                    <span>Quantity</span>
                    <span>Total</span>
                    <span></span>

                </div>


                ${itemsHtml}


                <a
                    href="products.html"
                    class="continue-btn">

                    ← Continue Shopping

                </a>

            </div>


            <aside class="summary-card">

                <h2>
                    Price Details
                </h2>


                <div class="summary-row">

                    <span>
                        Items
                    </span>

                    <span>
                        ${cart.reduce(
                            (a,b) =>
                            a + Number(b.quantity),
                            0
                        )}
                    </span>

                </div>


                <div class="summary-row">

                    <span>
                        Subtotal
                    </span>

                    <span>
                        ${formatPrice(subtotal)}
                    </span>

                </div>


                <div class="summary-row">

                    <span>
                        Delivery
                    </span>

                    <strong>
                        FREE
                    </strong>

                </div>


                <div class="summary-row total">

                    <span>
                        Grand Total
                    </span>

                    <span>
                        ${formatPrice(subtotal)}
                    </span>

                </div>


                <a
                    href="checkout.html"
                    class="checkout-btn">

                    Proceed to Checkout →

                </a>

            </aside>

        </div>

    `;

}


/* =========================================================
   CHECKOUT PAGE
========================================================= */

function renderCheckoutPage(){

    const container =
        document.getElementById(
            "checkoutContent"
        );


    if(!container){

        return;

    }


    const cart = getCart();


    if(cart.length === 0){

        container.innerHTML = `

            <div class="form-card">

                <div class="empty-checkout">

                    <h2>
                        Your cart is empty
                    </h2>

                    <p style="
                        color:#718892;
                        font-size:13px;
                        margin-top:7px;
                    ">
                        Add products before
                        proceeding to checkout.
                    </p>

                    <a href="products.html">
                        Browse Products
                    </a>

                </div>

            </div>

        `;

        return;

    }


    const total = getCartTotal();


    let itemsHtml = "";


    cart.forEach(item => {

        itemsHtml += `

            <div class="order-item">

                <img
                    src="${item.image}"
                    alt="${escapeHTML(item.name)}"
                    onerror="this.style.display='none'"
                >

                <div class="order-item-info">

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <small>
                        Quantity: ${item.quantity}
                    </small>

                </div>

                <span class="order-price">

                    ${formatPrice(
                        Number(item.price) *
                        Number(item.quantity)
                    )}

                </span>

            </div>

        `;

    });


    container.innerHTML = `

        <div class="checkout-layout">


            <section class="form-card">

                <h2>
                    Delivery Information
                </h2>


                <form
                    id="orderForm"
                    onsubmit="placeOrder(event)">


                    <div class="form-grid">


                        <div class="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                required
                                placeholder="Enter your name">

                        </div>


                        <div class="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                required
                                placeholder="Enter phone number">

                        </div>


                        <div class="form-group full">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                required
                                placeholder="Enter email address">

                        </div>


                        <div class="form-group full">

                            <label>
                                Delivery Address
                            </label>

                            <textarea
                                required
                                placeholder="House number, street, area..."></textarea>

                        </div>


                        <div class="form-group">

                            <label>
                                City
                            </label>

                            <input
                                type="text"
                                required
                                placeholder="City">

                        </div>


                        <div class="form-group">

                            <label>
                                PIN Code
                            </label>

                            <input
                                type="text"
                                required
                                maxlength="6"
                                placeholder="PIN Code">

                        </div>


                    </div>


                    <div class="payment-box">

                        <h2>
                            Payment Method
                        </h2>


                        <label class="payment-option">

                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                checked>

                            Cash on Delivery

                        </label>


                        <label class="payment-option">

                            <input
                                type="radio"
                                name="payment"
                                value="upi">

                            UPI / Digital Payment

                        </label>


                        <label class="payment-option">

                            <input
                                type="radio"
                                name="payment"
                                value="card">

                            Card Payment

                        </label>

                    </div>


                    <button
                        type="submit"
                        class="place-order">

                        Place Order →

                    </button>


                </form>

            </section>


            <aside class="order-card">

                <h2>
                    Your Order
                </h2>


                ${itemsHtml}


                <div class="summary-row"
                     style="margin-top:12px;">

                    <span>
                        Subtotal
                    </span>

                    <span>
                        ${formatPrice(total)}
                    </span>

                </div>


                <div class="summary-row">

                    <span>
                        Delivery
                    </span>

                    <strong>
                        FREE
                    </strong>

                </div>


                <div class="summary-total">

                    <span>
                        Total
                    </span>

                    <span>
                        ${formatPrice(total)}
                    </span>

                </div>


                <a
                    href="cart.html"
                    class="back-cart">

                    ← Back to Cart

                </a>

            </aside>


        </div>

    `;

}


/* =========================================================
   PLACE ORDER
========================================================= */

function placeOrder(event){

    event.preventDefault();


    const cart = getCart();


    if(cart.length === 0){

        alert(
            "Your cart is empty."
        );

        return;

    }


    const success =
        document.getElementById(
            "successMessage"
        );


    if(success){

        success.classList.add("show");

    }


    localStorage.removeItem(
        CART_KEY
    );


    updateCartCount();

}


/* =========================================================
   SEARCH
========================================================= */

function searchProducts(inputId){

    const input =
        document.getElementById(
            inputId
        );


    if(!input){

        return;

    }


    const query =
        input.value.trim();


    if(query === ""){

        window.location.href =
            "products.html";

        return;

    }


    window.location.href =
        "products.html?search=" +
        encodeURIComponent(query);

}


function performSearch(){

    const input =
        document.getElementById(
            "globalSearch"
        );


    if(input){

        const query =
            input.value.trim();


        if(query){

            window.location.href =
                "products.html?search=" +
                encodeURIComponent(query);

        }else{

            window.location.href =
                "products.html";

        }

    }

}


/* =========================================================
   PRODUCT SEARCH + FILTER
========================================================= */

function filterProducts(category, button){

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    if(button){

        button.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".product-card")
        .forEach(card => {

            if(
                category === "all" ||
                card.dataset.category === category
            ){

                card.style.display =
                    "";

            }else{

                card.style.display =
                    "none";

            }

        });

}


function runProductSearch(query){

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    if(!cards.length){

        return;

    }


    const cleanQuery =
        query.toLowerCase().trim();


    let found = false;


    cards.forEach(card => {

        const name =
            (
                card.dataset.name ||
                ""
            ).toLowerCase();


        const category =
            (
                card.dataset.category ||
                ""
            ).toLowerCase();


        if(
            cleanQuery === "" ||
            name.includes(cleanQuery) ||
            category.includes(cleanQuery)
        ){

            card.style.display =
                "";

            found = true;

        }else{

            card.style.display =
                "none";

        }

    });


    let noResults =
        document.getElementById(
            "searchNoResults"
        );


    if(!found){

        if(!noResults){

            noResults =
                document.createElement(
                    "div"
                );

            noResults.id =
                "searchNoResults";

            noResults.className =
                "no-results";

            noResults.textContent =
                "No products found.";

            const grid =
                document.getElementById(
                    "productGrid"
                );

            if(grid){

                grid.appendChild(
                    noResults
                );

            }

        }

    }else{

        if(noResults){

            noResults.remove();

        }

    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMenu(){

    const menu =
        document.getElementById(
            "mobileNav"
        );


    if(menu){

        menu.classList.toggle(
            "show"
        );

    }

}


/* =========================================================
   CONTACT
========================================================= */

function openContact(){

    const modal =
        document.getElementById(
            "contactModal"
        );


    if(modal){

        modal.classList.add(
            "show"
        );

    }

}


function closeContact(){

    const modal =
        document.getElementById(
            "contactModal"
        );


    if(modal){

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value){

    return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        updateCartCount();


        /* Product search */

        const productSearch =
            document.getElementById(
                "productSearch"
            );


        if(productSearch){

            productSearch.addEventListener(
                "input",
                function(){

                    runProductSearch(
                        this.value
                    );

                }
            );


            productSearch.addEventListener(
                "keypress",
                function(event){

                    if(
                        event.key === "Enter"
                    ){

                        searchProducts(
                            "productSearch"
                        );

                    }

                }
            );


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const query =
                params.get("search");


            if(query){

                productSearch.value =
                    query;

                runProductSearch(
                    query
                );

            }

        }


        /* Close contact modal */

        document.addEventListener(
            "click",
            function(event){

                const modal =
                    document.getElementById(
                        "contactModal"
                    );


                if(
                    modal &&
                    event.target === modal
                ){

                    closeContact();

                }

            }
        );

    }
);