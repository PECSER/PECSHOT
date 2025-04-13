document.addEventListener("DOMContentLoaded", () => {
  const sellBtn = document.getElementById("sellForCoinsBtn");
  const listBtn = document.getElementById("listForSaleBtn");
  const modal = document.querySelector(".modal");

  if (!modal) return; // нет модалки — выходим

  const itemId = modal.dataset.itemId;
  const itemName = modal.querySelector("h3")?.textContent?.replace("Продать ", "") || "";
  const itemImage = modal.querySelector("img")?.getAttribute("src") || "";
  const itemPrice = modal.querySelector("p")?.textContent?.replace("Цена: ", "").replace(" ₽", "") || "0";

  if (sellBtn) {
    sellBtn.addEventListener("click", () => {
      fetch("/shop/confirm-sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemId,
          name: itemName,
          image: itemImage,
          price: itemPrice,
          action: "coins"
        }),
      })
        .then((res) => res.text())
        .then(() => {
          window.location.href = "/inventory";
        })
        .catch((err) => {
          alert("Ошибка при продаже за коины");
          console.error(err);
        });
    });
  }

  if (listBtn) {
    listBtn.addEventListener("click", () => {
      fetch("/shop/confirm-sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemId,
          name: itemName,
          image: itemImage,
          price: itemPrice,
          action: "market"
        }),
      })
        .then((res) => res.text())
        .then(() => {
          window.location.href = "/shop";
        })
        .catch((err) => {
          alert("Ошибка при выставлении на продажу");
          console.error(err);
        });
    });
  }
});
