
function addToCart(name, price) {

  let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];

  cart.push({ name, price });

  localStorage.setItem('shopnova_cart', JSON.stringify(cart));

  alert(name + ' added to cart 🛒');
}

function toggleContactMenu() {

  const menu = document.getElementById('contactMenu');

  menu.style.display =
    menu.style.display === 'flex' ? 'none' : 'flex';
}

const searchInput = document.getElementById('searchInput');

if (searchInput) {

  searchInput.addEventListener('keyup', function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll('.product-card').forEach(card => {

      const name = card.querySelector('.product-name')
                       .innerText
                       .toLowerCase();

      card.style.display =
        name.includes(value) ? 'flex' : 'none';
    });
  });
}

