/* =============================================
   ADMIN PANEL JAVASCRIPT
   Tích hợp Firebase Auth & Firestore
   ============================================= */

// IMPORT FIREBASE (Sử dụng version 9/10 modular qua CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* 
  =============================================
  CẤU HÌNH FIREBASE CỦA BẠN 
  (Thay thế bằng config thực tế từ Firebase Console)
  ============================================= 
*/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Khởi tạo Firebase (Sẽ báo lỗi nếu chưa thay config chuẩn)
let app, auth, db;
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Chưa cấu hình Firebase! Đang sử dụng LocalStorage để Demo...");
}

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
if (isConfigured) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Đã đăng nhập
      loginContainer.style.display = 'none';
      dashboardContainer.style.display = 'flex';
      loadProducts();
      loadSettings();
    } else {
      // Chưa đăng nhập
      loginContainer.style.display = 'flex';
      dashboardContainer.style.display = 'none';
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-password').value;
    
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      loginError.textContent = '';
    } catch (error) {
      loginError.textContent = 'Sai email hoặc mật khẩu!';
    }
  });

  btnLogout.addEventListener('click', () => {
    signOut(auth);
  });
} else {
  // MOCK AUTH CHO DEMO
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'flex';
    loadProducts();
    loadSettings();
  });
  btnLogout.addEventListener('click', () => {
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
  });
}

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
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    renderTable(products);
    // Lưu tạm ra window để hàm sửa có thể truy cập
    window.currentProducts = products;
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
    name: document.getElementById('prod-name').value,
    tag: document.getElementById('prod-category').options[document.getElementById('prod-category').selectedIndex].text,
    category: document.getElementById('prod-category').value,
    price: Number(document.getElementById('prod-price').value),
    material: document.getElementById('prod-material').value,
    desc: document.getElementById('prod-desc').value,
    img: document.getElementById('prod-img').value,
  };

  if (isConfigured) {
    await setDoc(doc(db, "products", prodId), data);
  } else {
    // Mock Save
    let products = JSON.parse(localStorage.getItem('phuha_products')) || [];
    const index = products.findIndex(p => p.id === prodId);
    if (index > -1) {
      products[index] = { id: prodId, ...data };
    } else {
      products.push({ id: prodId, ...data });
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
    await deleteDoc(doc(db, "products", id));
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
  if (isConfigured) {
    const docSnap = await getDoc(doc(db, "settings", "general"));
    if (docSnap.exists()) {
      document.getElementById('site-hotline').value = docSnap.data().hotline || '';
      document.getElementById('site-address').value = docSnap.data().address || '';
    }
  } else {
    const s = JSON.parse(localStorage.getItem('phuha_settings')) || {};
    document.getElementById('site-hotline').value = s.hotline || '';
    document.getElementById('site-address').value = s.address || '';
  }
}

settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    hotline: document.getElementById('site-hotline').value,
    address: document.getElementById('site-address').value
  };

  if (isConfigured) {
    await setDoc(doc(db, "settings", "general"), data);
    alert("Đã lưu cài đặt!");
  } else {
    localStorage.setItem('phuha_settings', JSON.stringify(data));
    alert("Đã lưu cài đặt (Demo LocalStorage)!");
  }
});
