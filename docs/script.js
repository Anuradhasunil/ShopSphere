// FULL COMPREHENSIVE PRODUCT ARRAY - Includes the Gown to fill the empty slot
const products = [
    {
        id: 3,
        name: "Royal Indigo Jaipur Lounge Set",
        price: 14500,
        image: "images/loungewear.jpg" 
    },
    {
        id: 4,
        name: "Luxury Fashion Banner",
        price: 1999,
        image: "images/luxury-banner.jpg" 
    },
    {
        id: 5,
        name: "Imperial Gold Makeup Collection",
        price: 6400,
        image: "images/makeup.jpg" 
    },
    {
        id: 6,
        name: "Sovereign Red-Sole Oxford Shoes",
        price: 11500,
        image: "images/mens-shoes.jpg" 
    },
    {
        id: 7,
        name: "Noir Signature Perfume",
        price: 12999,
        image: "images/perfume.jpg" 
    },
    {
        id: 8,
        name: "Riviera Monogram Handbag",
        price: 85000,
        image: "images/bag.jpg" 
    },
    {
        id: 9,
        name: "ShopNova Wireless Earbuds Pro",
        price: 4999,
        image: "images/earbuds.jpg" 
    },
    {
        id: 10,
        name: "Aviator Elite Sunglasses",
        price: 8900,
        image: "images/sunglasses.jpg" 
    },
    {
        id: 11,
        name: "Stallion Supercar Display Key",
        price: 45000,
        image: "images/supercar-key.jpg" 
    },
    {
        id: 12,
        name: "Midnight Classic Tuxedo Suit",
        price: 32000,
        image: "images/tuxedo.jpg" 
    },
    {
        id: 13,
        name: "Siren Stiletto Women's Shoes",
        price: 18500,
        image: "images/womens-shoes.jpg" 
    },
    {
        id: 14,
        name: "Paris Haute Couture Gown",
        price: 245000,
        image: "images/suit.jpg" // Using suit.jpg since it contains the gown image in your folder
    }
];

// DYNAMIC RENDERING ENGINE - Generates clean responsive grids automatically
document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-grid");
    
    if (!productContainer) {
        return; 
    }

    productContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://placeholder.com'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join("");
});

function addToCart(productId) {
    console.log(`Product ID: ${productId} selected.`);
    alert(`Item added to cart successfully!`);
}
// ==========================================
// SHOPPING CART FUNCTIONAL LOGIC
// ==========================================

// Global state holding items currently inside your user shopping cart
let cartItems = [
    {
        id: 3,
        name: "Royal Indigo Jaipur Lounge Set",
        price: 14500,
        image: "images/loungewear.jpg",
        size: "M",
        color: "Royal Indigo"
    }
];

// Automatically execute calculation checks when the document finishes rendering
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

// Primary controller function that builds your row list layouts dynamically
function renderCart() {
    const cartContainer = document.querySelector(".cart-items-section");
    const subtotalElement = document.getElementById("cart-subtotal");
    const totalElement = document.getElementById("cart-total");

    // Guard safety clause if the active webpage is not cart.html
    if (!cartContainer) return;

    // Check if the cart array has been completely emptied out
    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                <p style="font-size: 18px; margin-bottom: 20px;">Your shopping cart is completely empty!</p>
                <a href="products.html" style="color: #04821a; font-weight: bold; text-decoration: none;">Go Explore Products →</a>
            </div>
        `;
        if (subtotalElement) subtotalElement.innerText = "₹0";
        if (totalElement) totalElement.innerText = "₹0";
        return;
    }

    // Map existing records to generate interactive rows inside the item box
    cartContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item-row" id="item-row-${item.id}">
            <div class="cart-item-img-box">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placeholder.com'">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-meta">Size: ${item.size} | Color: ${item.color}</p>
            </div>
            <div class="cart-item-pricing">
                <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
                <button class="cart-remove-btn" onclick="removeItemFromCart(${item.id})">🗑️ Remove</button>
            </div>
        </div>
    `).join("");

    // Calculate totals automatically 
    calculateCartTotals(subtotalElement, totalElement);
}

// Function to handle removing an item when the user clicks 'Remove'
function removeItemFromCart(itemId) {
    // Filter out the selected item matching the provided unique ID identifier
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    // Instantly refresh the UI layout grid elements safely
    renderCart();
}

// Helper calculation loop script module block
function calculateCartTotals(subtotalEl, totalEl) {
    const runningSum = cartItems.reduce((acc, item) => acc + item.price, 0);
    
    if (subtotalEl) subtotalEl.innerText = `₹${runningSum.toLocaleString('en-IN')}`;
    if (totalEl) totalEl.innerText = `₹${runningSum.toLocaleString('en-IN')}`;
}
// Function tracking form submission processes inside your checkout page
function handlePlaceOrder(event) {
    event.preventDefault(); // Prevents the page from refreshing layout variables
    
    const clientName = document.getElementById("full-name").value;
    const paymentChoice = document.getElementById("payment-method").value.toUpperCase();
    
    alert(`Thank you, ${clientName}! Your order has been placed successfully using payment mode: ${paymentChoice}.`);
    
    // Redirects user back home cleanly after confirmation
    window.location.href = "index.html";
}
