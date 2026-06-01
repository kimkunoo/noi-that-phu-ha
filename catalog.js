/* =============================================
   CATALOG PAGE JAVASCRIPT
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

// ── Product Data (mirrors HTML, used for quick view) ──
const products = [
  {
    name: "Sofa Bắc Âu",
    tag: "Phòng khách",
    material: "Gỗ Teak",
    desc: "Khung gỗ teak tự nhiên, đệm vải lanh cao cấp, thiết kế tối giản Scandinavian. Kích thước: 220cm x 90cm x 78cm (D×R×C). Tải trọng tối đa 400kg.",
    img: "images/product_sofa_set.png",
    price: "18.500.000 ₫"
  },
  {
    name: "Bàn Trà Nhật",
    tag: "Phòng khách",
    material: "Gỗ Sồi",
    desc: "Mặt bàn gỗ sồi nguyên khối, chân thấp phong cách Nhật Bản, tôn lên vẻ đẹp vân gỗ tự nhiên. Kích thước: 120cm x 60cm x 40cm. Hoàn thiện sơn dầu Osmo.",
    img: "images/product_coffee_table.png",
    price: "6.200.000 ₫"
  },
  {
    name: "Kệ TV Tối Giản",
    tag: "Phòng khách",
    material: "Gỗ Óc Chó",
    desc: "Kệ TV thấp phong cách wabi-sabi, gỗ óc chó Bắc Mỹ, có ngăn kéo ẩn và dây điện thông minh. Kích thước: 180cm x 40cm x 45cm. Chịu TV tới 75 inch.",
    img: "images/living_room_collection_1780022575585.png",
    price: "9.800.000 ₫"
  },
  {
    name: "Giường Ngủ Forest",
    tag: "Phòng ngủ",
    material: "Gỗ Óc Chó",
    desc: "Khung giường gỗ óc chó nguyên khối, đầu giường cao tạo điểm nhấn. Có 2 kích thước: 1m6 (Queen) và 1m8 (King). Tải trọng tối đa 500kg.",
    img: "images/product_bed_frame.png",
    price: "22.000.000 ₫"
  },
  {
    name: "Táp Đầu Giường",
    tag: "Phòng ngủ",
    material: "Gỗ Sồi",
    desc: "Táp đầu giường gỗ sồi 2 ngăn kéo, tay cầm đồng, bề mặt sơn dầu tự nhiên bảo vệ vân gỗ. Kích thước: 50cm x 40cm x 55cm.",
    img: "images/bedroom_collection_1780022546795.png",
    price: "5.500.000 ₫"
  },
  {
    name: "Tủ Quần Áo Sliding",
    tag: "Phòng ngủ",
    material: "Gỗ Teak",
    desc: "Tủ quần áo 3 buồng, cửa trượt kính mờ, khung gỗ teak nguyên khối, ray cửa Hettich Đức bảo hành 10 năm. Kích thước: 240cm x 60cm x 230cm.",
    img: "images/product_wardrobe.png",
    price: "32.000.000 ₫"
  },
  {
    name: "Bộ Bàn Ăn 6 Ghế",
    tag: "Phòng ăn",
    material: "Gỗ Sồi",
    desc: "Bàn ăn mặt liền khối 2m x 0.9m, 6 ghế có đệm vải lanh, chân thép đen kết hợp gỗ sồi tinh tế. Tải trọng bàn tối đa 300kg.",
    img: "images/product_dining_set.png",
    price: "28.500.000 ₫"
  },
  {
    name: "Bàn Ăn Live Edge",
    tag: "Phòng ăn",
    material: "Gỗ Me Tây",
    desc: "Bàn ăn cạnh tự nhiên (live edge) độc bản, gỗ me tây nguyên khối, chân chữ X thép đen thô. Mỗi bàn là tác phẩm độc nhất vô nhị. Kích thước: 150–200cm x 80–100cm.",
    img: "images/dining_collection_1780022707495.png",
    price: "12.800.000 ₫"
  },
  {
    name: "Kệ Sách Mở",
    tag: "Lưu trữ",
    material: "Gỗ Sồi",
    desc: "Kệ sách 5 tầng gỗ sồi tự nhiên, khung thép đen, thiết kế mở thoáng—điểm nhấn cho bất kỳ không gian nào. Kích thước: 90cm x 35cm x 180cm.",
    img: "images/hero_banner_1780022452830.png",
    price: "14.200.000 ₫"
  }
];

// ── State ──
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

// ── Quick View Modal ──
const overlay   = document.getElementById("modal-overlay");
const closeBtn  = document.getElementById("modal-close");

function openQuickView(index) {
  const p = products[index];
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
// Hero
gsap.from(".catalog-eyebrow", { y: 20, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1 });
gsap.from(".catalog-title",   { y: 40, opacity: 0, duration: 1.1, ease: "power4.out", delay: 0.2 });
gsap.from(".catalog-subtitle",{ y: 20, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.4 });

// Cards stagger on scroll
gsap.from(allCards, {
  scrollTrigger: { trigger: "#product-grid", start: "top 88%" },
  y: 50, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out"
});

// CTA
gsap.from(".catalog-cta-inner", {
  scrollTrigger: { trigger: ".catalog-cta", start: "top 85%" },
  y: 40, opacity: 0, duration: 1, ease: "power3.out"
});
