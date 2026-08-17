// Dynamic Shopping Cart Storage Engine
function add(name, price, imgUrl) {
    // 1. Retrieve the existing cart array from browser storage, or initialize an empty array if blank
    let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];

    // 2. Scan to see if this specific product metadata already exists in user's cart registry
    let existingItem = cart.find(item => item.productName === name);

    if (existingItem) {
        // If it is already there, increment the stack count
        existingItem.quantity += 1;
    } else {
        // Create an entirely new item dictionary mapping object parameters
        let newItem = {
            productName: name,
            productPrice: Number(price),
            productImage: imgUrl,
            quantity: 1
        };
        cart.push(newItem);
    }

    // 3. Save updated collection map adjustments safely back into local device session storage
    localStorage.setItem('shopnova_cart', JSON.stringify(cart));

    // 4. Fire an elegant non-blocking system alert panel updating checkout counts
    alert(`🎉 Successfully added "${name}" to your shopping basket!`);
    
    // Optional: Call a function to refresh any total count badges visible in your header navigation bars
    updateNavCartCount();
}

// Automatically counts total items in cart to display inside header icons
function updateNavCartCount() {
    let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Looks for your navbar span counter elements
    let cartBadge = document.querySelector('.navbar .cart-count'); 
    if (cartBadge) {
        cartBadge.innerText = totalItems;
    }
}

// Initialize count lookups automatically whenever pages load
document.addEventListener('DOMContentLoaded', updateNavCartCount);
