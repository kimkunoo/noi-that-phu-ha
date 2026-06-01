/* =============================================
   ADMIN PANEL JAVASCRIPT
   Tích hợp Firebase Auth & Firestore
   ============================================= */

// IMPORT SUPABASE
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://rrxbiygabevjfsmajiho.supabase.co";
const SUPABASE_KEY = "sb_publishable_mAqJ9fNj2U_k5U6XLa-OnA_7whmdDdQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const isConfigured = true;


// ── DOM Elements ──
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const btnLogout = document.getElementById('btn-logout');

const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');

const productsTbody = document.getElementById('products-tbody');
const btnAddProduct = document.getElementById('btn-add-product');
const productModal = document.getElementById('product-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const productForm = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');

const settingsForm = document.getElementById('settings-form');

// ── XỬ LÝ AUTH ──
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const pass = document.getElementById('admin-password').value;
  
  // Hardcoded Demo Auth
  if (email === 'admin@phuha.com' && pass === '123456') {
    loginError.textContent = '';
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'flex';
    loadProducts();
    loadSettings();
  } else {
    loginError.textContent = 'Sai thông tin! (Hãy dùng: admin@phuha.com / 123456)';
  }
});

btnLogout.addEventListener('click', () => {
  loginContainer.style.display = 'flex';
  dashboardContainer.style.display = 'none';
});

// ── CHUYỂN TAB (NAVIGATION) ──
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    viewSections.forEach(v => v.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.target).classList.add('active');
  });
});

// ── QUẢN LÝ SẢN PHẨM ──
function getFormatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Hàm render bảng
function renderTable(products) {
  productsTbody.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="../${p.img}" alt="${p.name}" onerror="this.src='${p.img}'"></td>
      <td><strong>${p.name}</strong></td>
      <td>${p.tag}</td>
      <td>${getFormatPrice(p.price)}</td>
      <td class="td-actions">
        <button class="btn btn-edit" onclick="editProduct('${p.id}')">Sửa</button>
        <button class="btn btn-danger" onclick="deleteProduct('${p.id}')">Xóa</button>
      </td>
    `;
    productsTbody.appendChild(tr);
  });
}

// Load dữ liệu
async function loadProducts() {
  if (isConfigured) {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) {
      renderTable(data);
      window.currentProducts = data;
    }
  } else {
    // Mock Data
    const mockData = JSON.parse(localStorage.getItem('phuha_products')) || [];
    renderTable(mockData);
    window.currentProducts = mockData;
  }
}

// Mở modal thêm
btnAddProduct.addEventListener('click', () => {
  productForm.reset();
  document.getElementById('prod-id').value = '';
  modalTitle.textContent = 'Thêm sản phẩm mới';
  productModal.classList.add('is-open');
});

// Đóng modal
btnCloseModal.addEventListener('click', () => {
  productModal.classList.remove('is-open');
});

// Submit Form (Thêm / Sửa)
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const prodId = document.getElementById('prod-id').value || `prod_${Date.now()}`;
  const data = {
    id: prodId,
    name: document.getElementById('prod-name').value,
    tag: document.getElementById('prod-category').options[document.getElementById('prod-category').selectedIndex].text,
    category: document.getElementById('prod-category').value,
    price: Number(document.getElementById('prod-price').value),
    material: document.getElementById('prod-material').value,
    desc: document.getElementById('prod-desc').value,
    img: document.getElementById('prod-img').value,
  };

  if (isConfigured) {
    await supabase.from('products').upsert(data);
  } else {
    // Mock Save
    let products = JSON.parse(localStorage.getItem('phuha_products')) || [];
    const index = products.findIndex(p => p.id === prodId);
    if (index > -1) {
      products[index] = data;
    } else {
      products.push(data);
    }
    localStorage.setItem('phuha_products', JSON.stringify(products));
  }

  productModal.classList.remove('is-open');
  loadProducts();
});

// Xóa sản phẩm
window.deleteProduct = async function(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
  
  if (isConfigured) {
    await supabase.from('products').delete().eq('id', id);
  } else {
    let products = JSON.parse(localStorage.getItem('phuha_products')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('phuha_products', JSON.stringify(products));
  }
  loadProducts();
};

// Mở modal Sửa
window.editProduct = function(id) {
  const p = window.currentProducts.find(x => x.id === id);
  if (!p) return;

  document.getElementById('prod-id').value = p.id;
  document.getElementById('prod-name').value = p.name;
  document.getElementById('prod-category').value = p.category || 'phong-khach';
  document.getElementById('prod-price').value = p.price;
  document.getElementById('prod-material').value = p.material;
  document.getElementById('prod-desc').value = p.desc;
  document.getElementById('prod-img').value = p.img;
  
  modalTitle.textContent = 'Sửa sản phẩm';
  productModal.classList.add('is-open');
};

// ── CÀI ĐẶT CHUNG ──
async function loadSettings() {
  const s = JSON.parse(localStorage.getItem('phuha_settings')) || {};
  document.getElementById('site-hotline').value = s.hotline || '';
  document.getElementById('site-address').value = s.address || '';
}

settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    hotline: document.getElementById('site-hotline').value,
    address: document.getElementById('site-address').value
  };
  localStorage.setItem('phuha_settings', JSON.stringify(data));
  alert("Đã lưu cài đặt tạm!");
});
