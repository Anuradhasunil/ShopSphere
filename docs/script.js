// =========================
// ADD TO CART
// =========================

function addToCart(name, price) {

  let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];

  cart.push({
    name: name,
    price: price
  });

  localStorage.setItem('shopnova_cart', JSON.stringify(cart));

  alert(name + ' added to cart 🛒');
}

// =========================
// CONTACT BUTTON
// =========================

function toggleContactMenu() {

  const menu = document.getElementById('contactMenu');

  if (!menu) return;

  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
}

// =========================
// SEARCH BAR
// =========================

document.addEventListener('DOMContentLoaded', function () {

  const searchInput = document.getElementById('searchInput');

  if (searchInput) {

    searchInput.addEventListener('keyup', function () {

      const value = searchInput.value.toLowerCase();

      const products = document.querySelectorAll('.product-card');

      products.forEach(function (card) {

        const productName = card.innerText.toLowerCase();

        if (productName.includes(value)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }

      });

    });

  }

});