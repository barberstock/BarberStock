// ===== CONFIGURACIÓN =====
// Cambia estas credenciales antes de desplegar
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'barber2026';

// Número WhatsApp por defecto para consultas
const DEFAULT_WHATSAPP = '573001234567';

// ===== PRODUCTOS DEMO (se cargan solo si localStorage está vacío) =====
const DEMO_PRODUCTS = [
  {
    id: 'demo1',
    name: 'Barbera Barber Pantalla LED',
    category: 'Máquinas',
    price: 44000,
    oldPrice: 88000,
    stock: 15,
    desc: 'Cortadora profesional con pantalla LED, 4 peinillas de guía, cable USB y cepillo de limpieza. Ideal para cortes fade y degradado. Batería de larga duración.',
    whatsapp: DEFAULT_WHATSAPP,
    image: ''
  },
  {
    id: 'demo2',
    name: 'Barbera Razor T-8 Dorada',
    category: 'Máquinas',
    price: 20000,
    oldPrice: 40000,
    stock: 22,
    desc: 'Afeitadora razor estilo vintage con diseño de Buda en dorado. Perfecta para perfiles y detalles. Cabezal flotante de triple hoja.',
    whatsapp: DEFAULT_WHATSAPP,
    image: ''
  },
  {
    id: 'demo3',
    name: 'Barbera Metálica Vintage T9',
    category: 'Máquinas',
    price: 35000,
    oldPrice: 55000,
    stock: 8,
    desc: 'Máquina recortadora metálica de cuerpo negro con cabezal dorado. Set completo con peinillas 1.5mm y 2mm, cable USB y caja de presentación.',
    whatsapp: DEFAULT_WHATSAPP,
    image: ''
  },
  {
    id: 'demo4',
    name: 'Barbera Vintage Multicolor',
    category: 'Máquinas',
    price: 38000,
    oldPrice: 60000,
    stock: 12,
    desc: 'Cortadora recargable con diseño multicolor gradiente. Incluye 3 peinillas guía y accesorio limpiador. Cargada via USB-C.',
    whatsapp: DEFAULT_WHATSAPP,
    image: ''
  },
  {
    id: 'demo5',
    name: 'Kit Navaja + Brocha + Soporte',
    category: 'Accesorios',
    price: 55000,
    oldPrice: 85000,
    stock: 5,
    desc: 'Kit completo de afeitado clásico: navaja de afeitar de acero inoxidable, brocha para espuma de crin de alta densidad y soporte de mesa para barbería.',
    whatsapp: DEFAULT_WHATSAPP,
    image: ''
  }
];

// ===== ESTADO GLOBAL =====
let products = [];
let filteredProducts = [];
let currentCategory = 'todos';
let isAdmin = false;
let editingId = null;
let currentImage = '';
let adminPanelOpen = false;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  checkAdminSession();
  renderCatalog();
});

// ===== GESTIÓN DE PRODUCTOS EN LOCALSTORAGE =====
function loadProducts() {
  const stored = localStorage.getItem('barber_products');
  if (stored) {
    products = JSON.parse(stored);
  } else {
    products = [...DEMO_PRODUCTS];
    saveProducts();
  }
}

function saveProducts() {
  localStorage.setItem('barber_products', JSON.stringify(products));
}

// ===== RENDER CATÁLOGO =====
function renderCatalog() {
  applyFilters();
  renderCategoryPills();
}

function renderCategoryPills() {
  const categories = ['todos', ...new Set(products.map(p => p.category).filter(Boolean))];
  const container = document.getElementById('categoryPills');
  container.innerHTML = categories.map(cat => `
    <button
      class="pill ${cat === currentCategory ? 'active' : ''}"
      onclick="setCategory('${cat}', this)"
    >${cat === 'todos' ? 'Todos' : cat}</button>
  `).join('');
}

function setCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyFilters();
}

function filterProducts() {
  applyFilters();
}

function applyFilters() {
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const sort = document.getElementById('sortSelect')?.value || 'default';

  let list = [...products];

  if (currentCategory !== 'todos') {
    list = list.filter(p => p.category === currentCategory);
  }

  if (search) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(search) ||
      (p.desc || '').toLowerCase().includes(search) ||
      (p.category || '').toLowerCase().includes(search)
    );
  }

  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  filteredProducts = list;
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('emptyState');

  if (filteredProducts.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = filteredProducts.map((p, i) => {
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
    const stockClass = p.stock <= 0 ? 'out' : p.stock <= 3 ? 'low' : '';
    const stockText = p.stock <= 0 ? '⚠ Sin stock' : p.stock <= 3 ? `⚠ Últimas ${p.stock} unidades` : `${p.stock} disponibles`;

    return `
      <div class="product-card" onclick="openProductModal('${p.id}')" style="animation-delay:${i * 0.06}s">
        ${p.image
          ? `<img class="card-img" src="${p.image}" alt="${escHtml(p.name)}" loading="lazy"/>`
          : `<div class="card-img-placeholder">✂</div>`}
        <div class="card-body">
          <div class="card-category">${escHtml(p.category || '')}</div>
          <div class="card-name">${escHtml(p.name)}</div>
          <div class="card-price-row">
            <span class="card-price">${formatPrice(p.price)}</span>
            ${p.oldPrice ? `<span class="card-old-price">${formatPrice(p.oldPrice)}</span>` : ''}
            ${discount ? `<span class="card-discount">-${discount}%</span>` : ''}
          </div>
          ${p.stock !== undefined && p.stock !== '' ? `<div class="card-stock ${stockClass}">${stockText}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ===== MODAL PRODUCTO =====
function openProductModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  const wa = p.whatsapp || DEFAULT_WHATSAPP;
  const waMsg = `Hola, estoy interesado en el producto: *${p.name}* (${formatPrice(p.price)}). ¿Tienen disponibilidad?`;

  document.getElementById('modalImg').src = p.image || '';
  document.getElementById('modalImg').style.display = p.image ? 'block' : 'none';
  document.getElementById('modalCategory').textContent = p.category || '';
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalDesc').textContent = p.desc || '';
  document.getElementById('modalPrice').textContent = formatPrice(p.price);
  document.getElementById('modalOldPrice').textContent = p.oldPrice ? formatPrice(p.oldPrice) : '';
  document.getElementById('modalOldPrice').style.display = p.oldPrice ? 'inline' : 'none';
  document.getElementById('modalDiscount').textContent = discount ? `-${discount}%` : '';
  document.getElementById('modalDiscount').style.display = discount ? 'inline' : 'none';
  document.getElementById('modalStock').textContent = p.stock !== undefined && p.stock !== '' ? `Disponibles: ${p.stock}` : '';
  document.getElementById('modalWhatsapp').href = `https://wa.me/${wa}?text=${encodeURIComponent(waMsg)}`;

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal(e) {
  if (e && e.target !== document.getElementById('productModal') && !e.target.classList.contains('modal-close')) return;
  if (e && e.target !== document.getElementById('productModal')) {
    if (!document.getElementById('productModal').contains(e.target) || e.target.classList.contains('modal-close')) {
      // ok
    } else {
      return;
    }
  }
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ===== ADMIN AUTH =====
function checkAdminSession() {
  const session = sessionStorage.getItem('barber_admin');
  if (session === 'true') {
    isAdmin = true;
    showAdminUI();
  }
}

function openAdminLogin() {
  if (isAdmin) {
    toggleAdminPanel();
    return;
  }
  document.getElementById('loginModal').classList.add('open');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').textContent = '';
  setTimeout(() => document.getElementById('loginUser').focus(), 100);
}

function closeLoginModal(e) {
  if (!e || e.target === document.getElementById('loginModal')) {
    document.getElementById('loginModal').classList.remove('open');
  }
}

document.getElementById('loginModal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('open');
});

document.getElementById('loginPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    isAdmin = true;
    sessionStorage.setItem('barber_admin', 'true');
    document.getElementById('loginModal').classList.remove('open');
    showAdminUI();
    showToast('✓ Sesión iniciada correctamente');
    setTimeout(() => openAdminPanel(), 200);
  } else {
    document.getElementById('loginError').textContent = '❌ Usuario o contraseña incorrectos';
    document.getElementById('loginPass').value = '';
  }
}

function logout() {
  isAdmin = false;
  sessionStorage.removeItem('barber_admin');
  closeAdminPanel();
  document.getElementById('fabAdmin').style.display = 'none';
  document.getElementById('adminToggleBtn').textContent = '⚙ Admin';
  showToast('Sesión cerrada');
}

function showAdminUI() {
  document.getElementById('fabAdmin').style.display = 'flex';
  document.getElementById('adminToggleBtn').textContent = '⚙ Panel';
}

// ===== ADMIN PANEL =====
function openAdminPanel() {
  adminPanelOpen = true;
  document.getElementById('adminPanel').classList.add('open');
  document.getElementById('adminPanel').scrollIntoView({ behavior: 'smooth' });
  renderAdminList();
  updateAdminCount();
}

function closeAdminPanel() {
  adminPanelOpen = false;
  document.getElementById('adminPanel').classList.remove('open');
}

function toggleAdminPanel() {
  if (adminPanelOpen) {
    closeAdminPanel();
  } else {
    openAdminPanel();
  }
}

function updateAdminCount() {
  document.getElementById('adminCount').textContent = products.length;
}

function renderAdminList() {
  const search = (document.getElementById('adminSearch')?.value || '').toLowerCase();
  let list = products;
  if (search) list = list.filter(p => p.name.toLowerCase().includes(search));

  document.getElementById('adminProductList').innerHTML = list.map(p => `
    <div class="admin-product-item">
      ${p.image
        ? `<img class="admin-item-img" src="${p.image}" alt="${escHtml(p.name)}"/>`
        : `<div class="admin-item-img-placeholder">✂</div>`}
      <div class="admin-item-info">
        <div class="admin-item-name">${escHtml(p.name)}</div>
        <div class="admin-item-price">${formatPrice(p.price)} · ${escHtml(p.category || '')}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-edit" title="Editar" onclick="editProduct('${p.id}')">✏</button>
        <button class="btn-delete" title="Eliminar" onclick="deleteProduct('${p.id}')">🗑</button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--gray);text-align:center;padding:1.5rem">Sin productos</p>';
}

// ===== CRUD PRODUCTOS =====
function saveProduct() {
  const name = document.getElementById('fName').value.trim();
  const category = document.getElementById('fCategory').value.trim();
  const price = parseFloat(document.getElementById('fPrice').value);

  if (!name || !category || isNaN(price) || price <= 0) {
    showToast('⚠ Nombre, categoría y precio son obligatorios');
    return;
  }

  const oldPrice = parseFloat(document.getElementById('fOldPrice').value) || null;
  const stock = parseInt(document.getElementById('fStock').value) || 0;
  const desc = document.getElementById('fDesc').value.trim();
  const whatsapp = document.getElementById('fWhatsapp').value.trim() || DEFAULT_WHATSAPP;

  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    if (idx > -1) {
      products[idx] = {
        ...products[idx],
        name, category, price, oldPrice, stock, desc, whatsapp,
        image: currentImage || products[idx].image
      };
      showToast('✓ Producto actualizado');
    }
  } else {
    const newProduct = {
      id: 'p_' + Date.now(),
      name, category, price, oldPrice, stock, desc, whatsapp,
      image: currentImage
    };
    products.unshift(newProduct);
    showToast('✓ Producto agregado');
  }

  saveProducts();
  resetForm();
  renderCatalog();
  renderAdminList();
  updateAdminCount();
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  editingId = id;
  currentImage = p.image || '';

  document.getElementById('fName').value = p.name;
  document.getElementById('fCategory').value = p.category || '';
  document.getElementById('fPrice').value = p.price;
  document.getElementById('fOldPrice').value = p.oldPrice || '';
  document.getElementById('fStock').value = p.stock || '';
  document.getElementById('fDesc').value = p.desc || '';
  document.getElementById('fWhatsapp').value = p.whatsapp || DEFAULT_WHATSAPP;

  if (p.image) {
    document.getElementById('imgPreview').src = p.image;
    document.getElementById('imgPreviewWrap').style.display = 'block';
    document.getElementById('imgPlaceholder').style.display = 'none';
  } else {
    document.getElementById('imgPreviewWrap').style.display = 'none';
    document.getElementById('imgPlaceholder').style.display = 'block';
  }

  document.getElementById('formTitle').textContent = '✏ Editar Producto';
  document.getElementById('fName').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function deleteProduct(id) {
  if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderCatalog();
  renderAdminList();
  updateAdminCount();
  showToast('🗑 Producto eliminado');
}

function resetForm() {
  editingId = null;
  currentImage = '';
  document.getElementById('fName').value = '';
  document.getElementById('fCategory').value = '';
  document.getElementById('fPrice').value = '';
  document.getElementById('fOldPrice').value = '';
  document.getElementById('fStock').value = '';
  document.getElementById('fDesc').value = '';
  document.getElementById('fWhatsapp').value = '';
  document.getElementById('imgPreview').src = '';
  document.getElementById('imgPreviewWrap').style.display = 'none';
  document.getElementById('imgPlaceholder').style.display = 'block';
  document.getElementById('formTitle').textContent = '➕ Nuevo Producto';
}

// ===== IMAGEN =====
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('⚠ La imagen no debe superar 5MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => {
    currentImage = ev.target.result;
    document.getElementById('imgPreview').src = currentImage;
    document.getElementById('imgPreviewWrap').style.display = 'block';
    document.getElementById('imgPlaceholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ===== UTILS =====
function formatPrice(n) {
  if (!n && n !== 0) return '';
  return '$ ' + Number(n).toLocaleString('es-CO');
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer;
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// Keyboard: Esc closes modals
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('productModal').classList.remove('open');
    document.getElementById('loginModal').classList.remove('open');
    document.body.style.overflow = '';
  }
});
