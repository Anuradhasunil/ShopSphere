// Synchronized Local Storage Shopping Cart Processor
function add(name, price, imgUrl) {
    // 1. Fetch active data registry arrays
    let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];

    // 2. Validate if target item exists inside current instance
    let existingItem = cart.find(item => item.productName === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        let newItem = {
            productName: name,
            productPrice: Number(price),
            productImage: imgUrl,
            quantity: 1
        };
        cart.push(newItem);
    }

    // 3. Stringify payload back to browser memory
    localStorage.setItem('shopnova_cart', JSON.stringify(cart));

    // 4. Alert user safely
    alert(`🎉 Added "${name}" to your cart!`);
    
    // 5. Instantly force sync navbar counter indicators
    updateNavCartCount();
}

// Counts up overall inventory totals across site locations
function updateNavCartCount() {
    let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    let cartBadge = document.querySelector('.cart-count'); 
    if (cartBadge) {
        cartBadge.innerText = totalItems;
    }
}

// Bind counting lookup actions to clear whenever document registers ready
document.addEventListener('DOMContentLoaded', updateNavCartCount);
