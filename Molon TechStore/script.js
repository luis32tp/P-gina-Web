// === Produtos ===
const produtosData = [
  { id: "p1", name: "Smartphone Galaxy X", price: 2199.00, category: "celulares", image: "imagens/celular.jpg" },
  { id: "p2", name: "Notebook Acer Aspire", price: 4299.00, category: "computadores", image: "imagens/notebook.jpg" },
  { id: "p3", name: "Fone Bluetooth Pro", price: 349.00, category: "acessorios", image: "imagens/fone.jpg" },
  { id: "p4", name: "Cabo USB-C 2m", price: 49.90, category: "acessorios", image: "imagens/cabo.jpg" },
  { id: "p5", name: "Smart TV 50''", price: 3499.00, category: "tvs", image: "imagens/tv.jpg" },
  { id: "p6", name: "PC Gamer ", price: 7999.00, category: "computadores", image: "imagens/pcgamer.jpg" },
  { id: "p7", name: "Mouse com fio", price: 159.90, category: "acessorios", image: "imagens/mouse.jpg" },
  { id: "p8", name: "iPhone 16 Pro", price: 8999.00, category: "celulares", image: "imagens/iphone.jpg" },
];

// === Renderiza produtos na página ===
function renderProducts(lista) {
  const container = document.getElementById('products-list');
  if (!container) return;
  container.innerHTML = '';

  lista.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'card produto';
    card.dataset.id = prod.id;
    card.dataset.name = prod.name;
    card.dataset.price = prod.price;

    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}">
      <div class="card-body">
        <h3>${prod.name}</h3>
        <p class="price">R$ ${prod.price.toFixed(2).replace('.', ',')}</p>
        <div class="card-actions">
          <button class="btn add-cart">Adicionar ao carrinho</button>
          <a class="link-more" href="#">Ver</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  attachAddCartListeners();
}

// === Botões "Adicionar ao carrinho" ===
function attachAddCartListeners() {
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.onclick = (e) => {
      const card = e.target.closest('.produto');
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      let cart = JSON.parse(localStorage.getItem('molon_cart_v1')) || [];
      const existing = cart.find(x => x.id === id);
      if (existing) existing.qty++;
      else cart.push({ id, name, price, qty: 1 });
      localStorage.setItem('molon_cart_v1', JSON.stringify(cart));

      e.target.textContent = 'Adicionado ✓';
      setTimeout(() => e.target.textContent = 'Adicionar ao carrinho', 900);

      updateCartCount();
      updateMiniCart();

      const imgEl = card.querySelector('img');
      if(imgEl) flyToCart(imgEl);
    };
  });
}

// === Filtro de produtos ===
function initFilter() {
  const searchInput = document.getElementById('search');
  const categorySelect = document.getElementById('category');

  function filtrar() {
    const termo = searchInput?.value.toLowerCase() || '';
    const cat = categorySelect?.value || '';
    const filtrados = produtosData.filter(p =>
      (!cat || p.category === cat) &&
      p.name.toLowerCase().includes(termo)
    );
    renderProducts(filtrados);
  }

  searchInput?.addEventListener('input', filtrar);
  categorySelect?.addEventListener('change', filtrar);

  renderProducts(produtosData);
}

initFilter();

// === Carrinho ===
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('molon_cart_v1')) || [];
  const tbody = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total');
  if (!tbody || !totalEl) return;

  tbody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" class="cart-qty" data-index="${index}">
      </td>
      <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
      <td>
        <button class="btn remove-cart" data-index="${index}">❌</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('molon_cart_v1')) || [];
  const qty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = qty);
}

function updateMiniCart() {
  const cart = JSON.parse(localStorage.getItem('molon_cart_v1')) || [];
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const miniCart = document.getElementById('mini-cart');
  if(!miniCart) return;

  document.getElementById('mini-cart-count').textContent = count;
  document.getElementById('mini-cart-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  miniCart.classList.toggle('hidden', count === 0);
}

document.addEventListener('input', e => {
  if(e.target.classList.contains('cart-qty')){
    const index = e.target.dataset.index;
    let cart = JSON.parse(localStorage.getItem('molon_cart_v1')) || [];
    cart[index].qty = parseInt(e.target.value) || 1;
    localStorage.setItem('molon_cart_v1', JSON.stringify(cart));
    renderCart();
    updateMiniCart();
  }
});

document.addEventListener('click', e => {
  if(e.target.classList.contains('remove-cart')){
    if(confirm('Deseja realmente remover este item do carrinho?')){
      const index = e.target.dataset.index;
      let cart = JSON.parse(localStorage.getItem('molon_cart_v1')) || [];
      cart.splice(index,1);
      localStorage.setItem('molon_cart_v1', JSON.stringify(cart));
      renderCart();
      updateMiniCart();
    }
  }

  if(e.target.id === 'checkout-btn'){
    alert('Compra finalizada! (exemplo)');
    localStorage.removeItem('molon_cart_v1');
    renderCart();
    updateMiniCart();
  }
});

// === Modal ===
const modal = document.getElementById('modal-produto');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalPrice = document.getElementById('modal-price');
const modalAddCart = document.getElementById('modal-add-cart');
let currentProduct = null;

document.addEventListener('click', e => {
  if(e.target.classList.contains('link-more')){
    const card = e.target.closest('.produto');
    currentProduct = produtosData.find(p => p.id === card.dataset.id);
    if(!currentProduct) return;

    modalImg.src = currentProduct.image;
    modalImg.alt = currentProduct.name;
    modalName.textContent = currentProduct.name;
    modalPrice.textContent = `R$ ${currentProduct.price.toFixed(2).replace('.', ',')}`;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
  }
});

document.querySelector('.close-modal')?.addEventListener('click', ()=>{
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
});

modalAddCart?.addEventListener('click', ()=>{
  if(!currentProduct) return;
  let cart = JSON.parse(localStorage.getItem('molon_cart_v1')) || [];
  const existing = cart.find(x => x.id === currentProduct.id);
  if(existing) existing.qty++;
  else cart.push({ id: currentProduct.id, name: currentProduct.name, price: currentProduct.price, qty: 1 });
  localStorage.setItem('molon_cart_v1', JSON.stringify(cart));
  updateCartCount();
  updateMiniCart();
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
});
// Menu Hambúrguer
const btnHamburger = document.querySelector('.btn-hamburger');
const mainNav = document.getElementById('main-nav');

btnHamburger?.addEventListener('click', () => {
  const expanded = btnHamburger.getAttribute('aria-expanded') === 'true' || false;
  btnHamburger.setAttribute('aria-expanded', !expanded);
  mainNav.classList.toggle('open');
});

// Inicializa carrinho
renderCart();
updateMiniCart();
