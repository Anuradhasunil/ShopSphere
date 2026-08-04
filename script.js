/* ==========================================
   SHOPNOVA PRO GLOBAL LOGIC & ENGINE
========================================== */

// ---------- THEME TOGGLE MECHANISM ----------
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('shopnova_theme', theme);
}

// Restore user theme preferences on window load
window.onload = function() {
  if (localStorage.getItem('shopnova_theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
};

// ---------- INTERACTIVE SEARCH REGEX ----------
function searchProduct(event) {
  if (event.key === 'Enter') {
    const value = event.target.value.toLowerCase();
    
    if (
      value.includes('shirt') ||
      value.includes('shoe') ||
      value.includes('watch') ||
      value.includes('laptop') ||
      value.includes('headphone')
    ) {
      window.location.href = 'products.html';
    } else {
      alert('❌ Product not available in ShopNova');
    }
  }
}

// ---------- TOGGLE FLOAT CONTACT PANEL ----------
function toggleContacts() {
  const menu = document.getElementById('contactMenu');
  if (menu) {
    if (menu.style.display === 'flex') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'flex';
    }
  }
}

// ---------- LOCAL STORAGE CART CORE ENGINE ----------
function addToCart(name, price, qty = 1) {
  let cart = JSON.parse(localStorage.getItem('shopnova_cart')) || [];
  
  // Check if item already exists to increment quantity instead of duplicating row
  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ name: name, price: price, qty: qty });
  }

  localStorage.setItem('shopnova_cart', JSON.stringify(cart));
  alert('🛒 ' + name + ' successfully added to cart!');
}

function changeQty(change, btn) {
  const qtyEl = btn.parentElement.querySelector('.qty');
  let qty = parseInt(qtyEl.innerText);
  qty += change;
  if (qty < 1) qty = 1;
  qtyEl.innerText = qty;
}

// ---------- AUTHENTICATION WORKFLOWS ----------
function signup() {
  const userEl = document.getElementById('username');
  const passEl = document.getElementById('password');
  
  if(!userEl.value || !passEl.value) {
    alert('⚠️ Please fill out all login registry spaces');
    return;
  }

  const user = {
    username: userEl.value,
    password: passEl.value
  };

  localStorage.setItem('shopnova_user', JSON.stringify(user));
  alert('✅ Signup successful! Please log in now.');
}

function login() {
  const saved = JSON.parse(localStorage.getItem('shopnova_user'));
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (saved && saved.username === username && saved.password === password) {
    localStorage.setItem('shopnova_loggedin', 'true');
    alert('🎉 Welcome back! Login successful!');
    window.location.href = 'index.html';
  } else {
    alert('❌ Invalid username or password entry');
  }
}

// ---------- ORDER LEDGER HISTORY ----------
function saveOrder(total) {
  let orders = JSON.parse(localStorage.getItem('shopnova_orders')) || [];
  orders.push({
    id: Date.now(),
    date: new Date().toLocaleString(),
    total: total
  });
  localStorage.setItem('shopnova_orders', JSON.stringify(orders));
}
