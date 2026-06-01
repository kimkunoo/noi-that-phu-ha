/* =============================================
   CATALOG PAGE JAVASCRIPT
   ============================================= */

// Start loading
window.addEventListener('DOMContentLoaded', loadProducts);

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://rrxbiygabevjfsmajiho.supabase.co";
const SUPABASE_KEY = "sb_publishable_mAqJ9fNj2U_k5U6XLa-OnA_7whmdDdQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const isConfigured = true;


gsap.registerPlugin(ScrollTrigger);

let products = [];

// ── Default Mock Data (nếu Firebase/LocalStorage trống) ──
const defaultProducts = [
  { id: "p1", name: "Sofa Bắc Âu", category: "phong-khach", tag: "Phòng khách", material: "Gỗ Teak", desc: "Khung gỗ teak tự nhiên, đệm vải lanh cao cấp.", img: "images/product_sofa_set.png", price: 18500000 },
  { id: "p2", name: "Bàn Trà Nhật", category: "phong-khach", tag: "Phòng khách", material: "Gỗ Sồi", desc: "Mặt bàn gỗ sồi nguyên khối.", img: "images/product_coffee_table.png", price: 6200000 },
  { id: "p3", name: "Kệ TV Tối Giản", category: "phong-khach", tag: "Phòng khách", material: "Gỗ Óc Chó", desc: "Kệ TV thấp phong cách wabi-sabi.", img: "images/living_room_collection_1780022575585.png", price: 9800000 },
  { id: "p4", name: "Giường Ngủ Forest", category: "phong-ngu", tag: "Phòng ngủ", material: "Gỗ Óc Chó", desc: "Khung giường gỗ óc chó nguyên khối.", img: "images/product_bed_frame.png", price: 22000000 },
  { id: "p5", name: "Táp Đầu Giường", category: "phong-ngu", tag: "Phòng ngủ", material: "Gỗ Sồi", desc: "Táp đầu giường gỗ sồi 2 ngăn kéo.", img: "images/bedroom_collection_1780022546795.png", price: 5500000 },
  { id: "p6", name: "Tủ Quần Áo Sliding", category: "phong-ngu", tag: "Phòng ngủ", material: "Gỗ Teak", desc: "Tủ quần áo 3 buồng, cửa trượt kính mờ.", img: "images/product_wardrobe.png", price: 32000000 },
  { id: "p7", name: "Bộ Bàn Ăn 6 Ghế", category: "phong-an", tag: "Phòng ăn", material: "Gỗ Sồi", desc: "Bàn ăn mặt liền khối 2m x 0.9m.", img: "images/product_dining_set.png", price: 28500000 },
  { id: "p8", name: "Bàn Ăn Live Edge", category: "phong-an", tag: "Phòng ăn", material: "Gỗ Me Tây", desc: "Bàn ăn cạnh tự nhiên (live edge).", img: "images/dining_collection_1780022707495.png", price: 12800000 },
  { id: "p9", name: "Kệ Sách Mở", category: "luu-tru", tag: "Lưu trữ", material: "Gỗ Sồi", desc: "Kệ sách 5 tầng gỗ sồi tự nhiên.", img: "images/hero_banner_1780022452830.png", price: 14200000 }
];

async function loadProducts() {
  if (isConfigured) {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error(error);
      products = defaultProducts;
    } else {
      products = data && data.length > 0 ? data : defaultProducts;
    }
  } else {
    products = JSON.parse(localStorage.getItem('phuha_products'));
    if (!products || products.length === 0) {
      products = defaultProducts;
      localStorage.setItem('phuha_products', JSON.stringify(defaultProducts));
    }
  }
  renderProductCards();
  initInteractions();
}

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const grid = document.getElementById("product-grid");
let allCards = [];

function renderProductCards() {
  grid.innerHTML = '';
  products.forEach((p, i) => {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.dataset.category = p.category || 'phong-khach';
    article.dataset.price = p.price;
    article.dataset.name = p.name;
    
    article.innerHTML = `
      <div class="product-img-wrap">
          <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='images/product_coffee_table.png'">
          <div class="product-actions">
              <button class="action-btn" id="wishlist-${p.id}" aria-label="Yêu thích">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
              <button class="action-btn" id="quickview-${p.id}" aria-label="Xem nhanh" onclick="window.openQuickView('${p.id}')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
          </div>
      </div>
      <div class="product-info">
          <div class="product-meta">
              <span class="product-tag">${p.tag}</span>
              <span class="product-material">${p.material}</span>
          </div>
          <h2 class="product-name">${p.name}</h2>
          <p class="product-desc">${p.desc}</p>
          <div class="product-footer">
              <div class="product-price">
                  <span class="price-current">${formatPrice(p.price)}</span>
              </div>
              <a href="index.html#contact" class="btn-order">Đặt hàng</a>
          </div>
      </div>
    `;
    grid.appendChild(article);
  });
  allCards = Array.from(grid.querySelectorAll(".product-card"));
}
let activeFilter = "all";
let activeSort   = "default";

// ── DOM refs ──
const grid       = document.getElementById("product-grid");
const allCards   = Array.from(grid.querySelectorAll(".product-card"));
const countEl    = document.getElementById("product-count");
const emptyEl    = document.getElementById("empty-state");
const filterTabs = document.querySelectorAll(".filter-tab");
const sortSelect = document.getElementById("sort-select");

// ── Filter + Sort logic ──
function applyFilter() {
  let visible = allCards.filter(card => {
    const cat = card.dataset.category;
    return activeFilter === "all" || cat === activeFilter;
  });

  // Sort
  if (activeSort === "price-asc") {
    visible.sort((a, b) => +a.dataset.price - +b.dataset.price);
  } else if (activeSort === "price-desc") {
    visible.sort((a, b) => +b.dataset.price - +a.dataset.price);
  } else if (activeSort === "name-asc") {
    visible.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name, "vi"));
  }

  const hidden = allCards.filter(c => !visible.includes(c));

  // Hide cards not matching
  hidden.forEach(card => {
    card.style.display = "none";
    card.classList.remove("is-showing");
  });

  // Re-order and show matching cards
  visible.forEach((card, i) => {
    card.style.display = "flex";
    card.style.animationDelay = `${i * 0.06}s`;
    card.classList.remove("is-showing");
    // Force reflow to restart animation
    void card.offsetWidth;
    card.classList.add("is-showing");
    grid.appendChild(card); // re-order in DOM
  });

  // Update count
  const n = visible.length;
  countEl.innerHTML = `Đang hiển thị <strong>${n}</strong> sản phẩm`;
  emptyEl.style.display = n === 0 ? "block" : "none";
}

// Filter tabs
filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected","false"); });
    tab.classList.add("active");
    tab.setAttribute("aria-selected","true");
    activeFilter = tab.dataset.filter;
    applyFilter();
  });
});

// Sort
sortSelect.addEventListener("change", () => {
  activeSort = sortSelect.value;
  applyFilter();
});

// ── Wishlist toggle ──
function initInteractions() {
  document.querySelectorAll(".action-btn[id^='wishlist-']").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-wishlisted");
      const svg = btn.querySelector("svg path");
      if (btn.classList.contains("is-wishlisted")) {
        svg.setAttribute("fill", "currentColor");
        btn.setAttribute("aria-label", "Bỏ yêu thích");
        gsap.fromTo(btn, { scale: 1 }, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" });
      } else {
        svg.setAttribute("fill", "none");
        btn.setAttribute("aria-label", "Yêu thích");
      }
    });
  });
}

// ── Quick View Modal ──
const overlay   = document.getElementById("modal-overlay");
const closeBtn  = document.getElementById("modal-close");

window.openQuickView = function(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById("modal-img").src        = p.img;
  document.getElementById("modal-img").alt        = p.name;
  document.getElementById("modal-product-name").textContent = p.name;
  document.getElementById("modal-tag").textContent     = p.tag;
  document.getElementById("modal-material").textContent = p.material;
  document.getElementById("modal-desc").textContent    = p.desc;
  document.getElementById("modal-price").textContent   = p.price;
  document.getElementById("spec-material").textContent = p.material;

  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ── Mobile Menu ──
const hamburger  = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("is-open");
  mobileMenu.classList.toggle("is-open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});

// Close mobile menu on link click
mobileMenu.querySelectorAll(".mobile-nav-link").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  });
});

// ── Header scroll behaviour ──
const header = document.getElementById("site-header");
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const cur = window.pageYOffset;
  if (cur <= 0) { header.style.transform = "translateY(0)"; return; }
  header.style.transform = cur > lastScroll && cur > 100
    ? "translateY(-100%)"
    : "translateY(0)";
  lastScroll = cur;
}, { passive: true });

// ── GSAP entrance animations ──
setTimeout(() => {
  // Hero
  gsap.from(".catalog-eyebrow", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1 });
  gsap.from(".catalog-title",   { y: 40, opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.2 });
  gsap.from(".catalog-subtitle",{ y: 20, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.4 });

  // Cards stagger on scroll
  if (allCards.length > 0) {
    gsap.from(allCards, {
      scrollTrigger: { trigger: "#product-grid", start: "top 88%" },
      y: 50, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out"
    });
  }
}, 300);

// CTA
gsap.from(".catalog-cta-inner", {
  scrollTrigger: { trigger: ".catalog-cta", start: "top 85%" },
  y: 40, opacity: 0, duration: 1, ease: "power3.out"
});
