async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        const container = document.querySelector('.products');
        
        container.innerHTML = data.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">₹${product.price}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
fetchProducts();
