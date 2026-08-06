
function addToCart(name, price){

  let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];

  cart.push({name, price});

  localStorage.setItem('shopnova_cart', JSON.stringify(cart));

  alert(name + ' added to cart 🛒');
}

function toggleContactMenu(){

  const menu = document.getElementById('contactMenu');

  if(menu){
    menu.style.display =
      menu.style.display === 'flex' ? 'none' : 'flex';
  }
}

