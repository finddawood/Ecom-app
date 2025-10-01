document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".buy-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name || "Product";
      const price = btn.dataset.price || 0;

      openCartPopup(id, name, price);
    });
  });
});

function openCartPopup(productId, name, price) {
  const modal = document.getElementById("checkoutModal");
  const inner = document.getElementById("checkoutInner");

  modal.style.display = "block";
  inner.innerHTML = `
    <h3>${name}</h3>
    <p>Price: £${parseFloat(price).toFixed(2)}</p>
    <label>Quantity</label>
    <input type="number" id="qty" value="1" min="1" class="form-control mb-3">
    <button class="btn btn-success" onclick="confirmCart('${productId}', '${name}', ${price})">Confirm</button>
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
  `;
}

function closeModal() {
  document.getElementById("checkoutModal").style.display = "none";
}

function confirmCart(productId, name, price) {
  const qty = document.getElementById("qty").value;
  const order = {
    items: [{ productId, name, price, qty }],
    payer: { name: "Test User", email: "test@example.com" },
    paymentId: "DUMMY-" + Date.now(),
    total: price * qty
  };

  fetch('/orders/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
    .then(r => r.json())
    .then(resp => {
      if (resp.success || resp.order) {
        document.getElementById('checkoutInner').innerHTML = `
          <p>✅ Added to orders. <a href="/orders">View orders</a></p>
          <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        `;
      } else {
        alert("❌ Failed to save order.");
      }
    });
}
