const money = (amount) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: window.TINYTRAIL_CONFIG?.currency || "USD"
}).format(amount);

const getCart = () => JSON.parse(localStorage.getItem("tinytrail_cart") || "[]");
const saveCart = (cart) => {
  localStorage.setItem("tinytrail_cart", JSON.stringify(cart));
  updateCartCount();
};

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => el.textContent = count);
}

function findProduct(id) {
  return (window.TINYTRAIL_PRODUCTS || []).find((product) => product.id === id);
}

function addToCart(id, qty = 1) {
  const product = findProduct(id);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart.`);
}

function removeFromCart(id) {
  saveCart(getCart().filter((item) => item.id !== id));
  renderCartPage();
}

function changeQty(id, delta) {
  const cart = getCart().map((item) => {
    if (item.id === id) item.qty = Math.max(1, item.qty + delta);
    return item;
  });
  saveCart(cart);
  renderCartPage();
}

function cartTotals() {
  const items = getCart()
    .map((item) => ({ ...item, product: findProduct(item.id) }))
    .filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = subtotal > 0 && subtotal < 200 ? 12 : 0;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = subtotal + shipping + tax;
  return { items, subtotal, shipping, tax, total };
}

function showToast(message) {
  let toast = document.querySelector("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "24px";
    toast.style.transform = "translateX(-50%) translateY(100px)";
    toast.style.background = "rgba(14, 43, 70, 0.95)";
    toast.style.color = "white";
    toast.style.padding = "16px 24px";
    toast.style.borderRadius = "20px";
    toast.style.zIndex = "999";
    toast.style.boxShadow = "0 20px 40px rgba(14, 43, 70, 0.25)";
    toast.style.backdropFilter = "blur(10px)";
    toast.style.webkitBackdropFilter = "blur(10px)";
    toast.style.border = "1px solid rgba(255,255,255,0.1)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "12px";
    toast.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    toast.style.fontWeight = "700";
    toast.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease";
    toast.style.opacity = "0";
    toast.style.pointerEvents = "none";
    document.body.appendChild(toast);
  }
  
  toast.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;
  
  requestAnimationFrame(() => {
    toast.style.transform = "translateX(-50%) translateY(0)";
    toast.style.opacity = "1";
  });
  
  setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(100px)";
    toast.style.opacity = "0";
  }, 2500);
}

function renderProducts(targetId, limit) {
  const target = document.querySelector(targetId);
  if (!target) return;
  const products = (window.TINYTRAIL_PRODUCTS || []).slice(0, limit || 99);
  target.innerHTML = products.map((product) => `
    <article class="card product-card scroll-reveal">
      <a href="product.html?id=${product.id}">
        <div class="img-wrapper">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
      </a>
      <div class="product-meta">
        <div>
          <h3 style="font-size: 19px; margin-bottom: 4px;">${product.name}</h3>
          <p class="small" style="margin-bottom: 0;">${product.age} • ${product.size}</p>
        </div>
        <div class="price">${money(product.price)}</div>
      </div>
      <p style="font-size: 14px; margin-bottom: 20px;">${product.description}</p>
      <div class="actions" style="margin-top: auto;">
        <button class="button primary" onclick="addToCart('${product.id}')" style="min-height: 44px; padding: 10px 20px; font-size: 14px;">Add to Cart</button>
        <a class="button secondary" href="product.html?id=${product.id}" style="min-height: 44px; padding: 10px 20px; font-size: 14px;">Details</a>
      </div>
    </article>
  `).join("");
}

function renderProductDetail() {
  const mount = document.querySelector("#product-detail");
  if (!mount) return;
  const id = new URLSearchParams(window.location.search).get("id") || "tinytrail-16";
  const product = findProduct(id) || findProduct("tinytrail-16");
  mount.innerHTML = `
    <div class="hero-card scroll-reveal">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="scroll-reveal" style="display: flex; flex-direction: column; justify-content: center;">
      <p class="eyebrow">${product.age} • ${product.size}</p>
      <h1 style="font-size: clamp(32px, 5vw, 48px); margin-bottom: 12px;">${product.name}</h1>
      <p style="font-size: 16px; margin-bottom: 18px;">${product.description}</p>
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
        <div class="price" style="font-size: 32px;">${money(product.price)}</div>
        <div class="badges" style="margin-top: 0;">
          <span class="badge" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.2); color: var(--green);">Free Shipping</span>
        </div>
      </div>
      <div class="badges" style="margin-top: 0; margin-bottom: 24px;">
        <span class="badge">Safety checked</span>
        <span class="badge">Easy assembly</span>
        <span class="badge">Secure checkout</span>
      </div>
      <h3 style="margin-top: 10px; margin-bottom: 12px; font-size: 18px;">What’s included:</h3>
      <ul class="features-list">
        ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <div class="actions" style="margin-top: 24px;">
        <button class="button primary" onclick="addToCart('${product.id}')" style="flex: 1; min-width: 160px;">Add to Cart</button>
        <a class="button dark" href="checkout.html" onclick="addToCart('${product.id}')" style="flex: 1; min-width: 160px;">Buy Now</a>
      </div>
    </div>
  `;
}

function renderCartPage() {
  const cartItems = document.querySelector("#cart-items");
  const summary = document.querySelector("#cart-summary");
  if (!cartItems || !summary) return;
  const totals = cartTotals();

  if (!totals.items.length) {
    cartItems.innerHTML = `
      <div class="card" style="text-align: center; padding: 48px 24px;">
        <h3 style="font-size: 24px; margin-bottom: 12px;">Your cart is empty.</h3>
        <p style="margin-bottom: 24px;">Add a children’s bike to start your order.</p>
        <a class="button primary" href="shop.html">Shop Bikes</a>
      </div>
    `;
  } else {
    cartItems.innerHTML = totals.items.map((item) => `
      <div class="cart-row scroll-reveal">
        <img src="${item.product.image}" alt="${item.product.name}">
        <div>
          <h3 style="font-size: 18px; margin-bottom: 4px;">${item.product.name}</h3>
          <p class="small" style="margin-bottom: 8px;">${item.product.age} • ${item.product.size}</p>
          <div class="qty">
            <button aria-label="Decrease quantity" onclick="changeQty('${item.id}', -1)">−</button>
            <strong style="min-width: 20px; text-align: center;">${item.qty}</strong>
            <button aria-label="Increase quantity" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <div class="cart-actions">
          <strong>${money(item.product.price * item.qty)}</strong><br>
          <button class="button secondary" style="margin-top:12px; min-height: 38px; padding: 8px 16px; font-size: 13px;" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    `).join("");
  }

  summary.innerHTML = summaryHtml(totals);
}

function summaryHtml(totals) {
  return `
    <div class="summary">
      <div class="summary-row"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
      <div class="summary-row"><span>Shipping</span><strong>${totals.shipping === 0 ? "Free" : money(totals.shipping)}</strong></div>
      <div class="summary-row"><span>Estimated tax</span><strong>${money(totals.tax)}</strong></div>
      <div class="summary-row total"><span>Total</span><span>${money(totals.total)}</span></div>
    </div>
  `;
}

function renderCheckoutPage() {
  const summary = document.querySelector("#checkout-summary");
  const orderItems = document.querySelector("#checkout-items");
  if (!summary || !orderItems) return;
  const totals = cartTotals();
  if (!totals.items.length) {
    orderItems.innerHTML = `<div class="notice">Your cart is empty. Add a bike before checkout.</div>`;
  } else {
    orderItems.innerHTML = totals.items.map((item) => `
      <div class="summary-row scroll-reveal">
        <span>${item.product.name} × ${item.qty}</span>
        <strong>${money(item.product.price * item.qty)}</strong>
      </div>
    `).join("");
  }
  summary.innerHTML = summaryHtml(totals);

  const stripe = document.querySelector("#stripe-pay");
  const paypal = document.querySelector("#paypal-pay");
  if (stripe) stripe.href = window.TINYTRAIL_CONFIG.stripePaymentLink;
  if (paypal) paypal.href = window.TINYTRAIL_CONFIG.paypalPaymentLink;
}

function demoCheckout(event) {
  event.preventDefault();
  const totals = cartTotals();
  if (!totals.items.length) {
    showToast("Your cart is empty.");
    return;
  }
  const form = new FormData(event.target);
  const order = {
    customer: Object.fromEntries(form.entries()),
    total: totals.total,
    items: totals.items.map((item) => ({ id: item.id, qty: item.qty, name: item.product.name })),
    date: new Date().toISOString()
  };
  sessionStorage.setItem("tinytrail_last_order", JSON.stringify(order));
  localStorage.removeItem("tinytrail_cart");
  window.location.href = "thank-you.html";
}

function renderThankYou() {
  const mount = document.querySelector("#thank-you-order");
  if (!mount) return;
  const order = JSON.parse(sessionStorage.getItem("tinytrail_last_order") || "null");
  if (!order) {
    mount.innerHTML = `
      <p style="text-align: center; font-size: 16px; margin: 20px 0;">No recent demo order found. For live payments, the customer will return here after Stripe or PayPal payment setup.</p>
    `;
    return;
  }
  mount.innerHTML = `
    <div style="background: rgba(255, 111, 0, 0.03); border: 1px dashed var(--line); border-radius: var(--radius-md); padding: 24px; margin: 24px 0; text-align: left;">
      <p style="margin-bottom: 12px; font-size: 16px;"><strong>Demo order total:</strong> <span class="price" style="font-size: 20px; margin-left: 8px;">${money(order.total)}</span></p>
      <p style="margin-bottom: 12px; font-size: 16px;"><strong>Email:</strong> ${order.customer.email || "Not provided"}</p>
      <p style="margin-bottom: 0; font-size: 14px; color: var(--muted); line-height: 1.5;">Next step: replace the test payment links in <code>assets/js/config.js</code> with your real Stripe or PayPal checkout links.</p>
    </div>
  `;
}

function setupMobileMenu() {
  const btn = document.querySelector("[data-menu-button]");
  const links = document.querySelector("[data-navlinks]");
  if (!btn || !links) return;
  btn.addEventListener("click", () => {
    links.classList.toggle("open");
    btn.textContent = links.classList.contains("open") ? "Close" : "Menu";
  });
}

function setupFaqAccordion() {
  document.querySelectorAll(".faq-question").forEach((item) => {
    item.addEventListener("click", () => {
      const parent = item.parentElement;
      const isOpen = parent.classList.contains("open");
      
      document.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("open");
      });
      
      if (!isOpen) {
        parent.classList.add("open");
      }
    });
  });
}

// Float inputs checking on blur to keep floating label active if input is not empty
function setupInputLabelCheck() {
  document.querySelectorAll(".input-group input, .input-group textarea, .input-group select").forEach((input) => {
    const checkValue = () => {
      if (input.value !== "") {
        input.setAttribute("value", input.value);
      } else {
        input.removeAttribute("value");
      }
    };
    input.addEventListener("blur", checkValue);
    input.addEventListener("change", checkValue);
    checkValue();
  });
}

// Highlight current page nav link
function highlightActiveLink() {
  const path = window.location.pathname;
  const page = path.split("/").pop() || "index.html";
  document.querySelectorAll(".navlinks a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === page) {
      link.style.color = "var(--orange)";
      link.style.background = "rgba(255, 111, 0, 0.05)";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  updateCartCount();
  renderProducts("#featured-products", 3);
  renderProducts("#shop-products");
  renderProductDetail();
  renderCartPage();
  renderCheckoutPage();
  renderThankYou();
  setupFaqAccordion();
  setupInputLabelCheck();
  highlightActiveLink();

  const checkoutForm = document.querySelector("#checkout-form");
  if (checkoutForm) checkoutForm.addEventListener("submit", demoCheckout);
});
