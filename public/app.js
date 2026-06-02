const productGrid = document.querySelector("#product-grid");
const metricsGrid = document.querySelector("#metrics-grid");
const chatPanel = document.querySelector("#chat");
const chatFab = document.querySelector("#chat-fab");
const openChatButton = document.querySelector("#open-chat");
const minimizeChatButton = document.querySelector("#minimize-chat");
const chatMessages = document.querySelector("#chat-messages");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const quickReplies = document.querySelector("#quick-replies");

let chatStarted = false;

init();

async function init() {
  await loadProducts();
  await refreshMetrics();
  await startChat();
  setInterval(refreshMetrics, 5000);
}

async function loadProducts() {
  const response = await fetch("/api/products");
  const { products } = await response.json();

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <h3>${product.name}</h3>
            <p>${product.specs}</p>
          </div>
          <div class="product-meta">
            <span>S/ ${product.price.toLocaleString("es-PE")}</span>
            <span class="stock">${product.stock} en stock</span>
          </div>
          <button class="add-button" type="button" data-product="${product.name}">Consultar</button>
        </article>
      `
    )
    .join("");

  productGrid.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => {
      openChat();
      sendMessage(`Quiero informacion sobre ${button.dataset.product}`);
    });
  });
}

async function startChat() {
  if (chatStarted) return;
  chatStarted = true;
  const response = await fetch("/api/chat/start", { method: "POST" });
  const data = await response.json();
  appendMessage("bot", data.reply);
  renderQuickReplies(data.quickReplies);
  await refreshMetrics();
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  chatInput.value = "";
  await sendMessage(message);
});

openChatButton.addEventListener("click", openChat);
chatFab.addEventListener("click", openChat);
minimizeChatButton.addEventListener("click", () => {
  chatPanel.classList.add("is-hidden");
  chatFab.classList.add("is-visible");
});

async function sendMessage(message) {
  appendMessage("user", message);
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  appendMessage("bot", data.reply);
  if (data.products?.length) appendProducts(data.products);
  renderQuickReplies(data.quickReplies);
  await refreshMetrics();
}

function appendMessage(author, text) {
  const item = document.createElement("div");
  item.className = `message ${author}`;
  item.textContent = text;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendProducts(products) {
  const wrapper = document.createElement("div");
  wrapper.className = "chat-products";
  wrapper.innerHTML = products
    .map(
      (product) => `
        <div class="chat-product">
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <strong>${product.name}</strong>
            <span>S/ ${product.price.toLocaleString("es-PE")} · ${product.stock} en stock</span>
          </div>
        </div>
      `
    )
    .join("");
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderQuickReplies(replies = []) {
  quickReplies.innerHTML = replies
    .map((reply) => `<button type="button">${reply}</button>`)
    .join("");
  quickReplies.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => sendMessage(button.textContent));
  });
}

function openChat() {
  chatPanel.classList.remove("is-hidden");
  chatFab.classList.remove("is-visible");
  chatInput.focus();
}

async function refreshMetrics() {
  const response = await fetch("/api/metrics");
  const data = await response.json();
  const items = [
    ["conversations", "Conversaciones"],
    ["messages", "Mensajes"],
    ["recommendations", "Recomendaciones"],
    ["escalations", "Escalamientos"],
  ];

  metricsGrid.innerHTML = items
    .map(([key, label]) => `<div class="metric"><strong>${data[key] || 0}</strong><span>${label}</span></div>`)
    .join("");
}
