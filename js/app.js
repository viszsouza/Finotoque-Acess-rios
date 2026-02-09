const WHATSAPP_NUMBER = "5581987449319"; // <-- TROQUE AQUI

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// HAMBURGUER
const hamburguer = document.querySelector(".hamburguer");
const nav = document.querySelector(".nav");
const navlist = document.querySelector(".nav-list")

navlist.addEventListener("click", () => nav.classList.toggle("active"));
hamburguer.addEventListener("click", () => nav.classList.toggle("active"));


// ADICIONAR AO CARRINHO
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produto adicionado ao carrinho!");
}

// RENDERIZA CARRINHO
function renderCart() {
    const list = document.getElementById("cart-list");
    const totalEl = document.getElementById("cart-total");

    if (!list || !totalEl) return;

    list.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        list.innerHTML += `
            <li>
                <span>${item.name} — R$ ${item.price.toFixed(2)}</span>
                <button class="remove-btn" onclick="removeItem(${index})">X</button>
            </li>
        `;
    });

    totalEl.textContent = total.toFixed(2);
}

function removeItem(index) {
    cart.splice(index, 1); // remove 1 item
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}


// FILTRO DE PRODUTOS
function filterProducts() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const material = document.getElementById("materialFilter").value;
    const price = document.getElementById("priceFilter").value;

    document.querySelectorAll(".product-card").forEach(product => {
        const name = product.dataset.name.toLowerCase();
        const prodCategory = product.dataset.category;
        const prodMaterial = product.dataset.material;
        const prodPrice = parseFloat(product.dataset.price);

        let priceMatch = true;
        if (price === "0-100") priceMatch = prodPrice <= 100;
        if (price === "100-200") priceMatch = prodPrice > 100 && prodPrice <= 200;
        if (price === "200+") priceMatch = prodPrice > 200;

        const match =
            name.includes(search) &&
            (category === "" || category === prodCategory) &&
            (material === "" || material === prodMaterial) &&
            priceMatch;

        product.style.display = match ? "block" : "none";
    });
}

// ENVIA PEDIDO PARA O WHATSAPP
function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    let message = "🛍️ *Novo pedido - Loja de Semijoias* %0A%0A";
    let total = 0;

    cart.forEach((item, index) => {
        message += `• ${item.name} — R$ ${item.price.toFixed(2)}%0A`;
        total += item.price;
    });

    message += `%0A*Total:* R$ ${total.toFixed(2)}%0A`;
    message += `%0A📦 Aguardo informações de pagamento e entrega.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", renderCart);
