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
