// public/js/main.js — главный скрипт сайта
document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js инициализирован");

  // Пример обработчика формы для чата (если есть)
  const messageForm = document.getElementById("messageForm");
  const messageInput = document.getElementById("messageInput");
  const chatBox = document.getElementById("chatBox");

  if (messageForm) {
    messageForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = messageInput.value.trim();
      if (!message) return;

      try {
        const res = await fetch("/chat/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });
        const data = await res.json();
        if (data.success) {
          const newMsg = document.createElement("div");
          newMsg.textContent = `Вы: ${message}`;
          chatBox.appendChild(newMsg);
          messageInput.value = "";
        } else {
          alert("Ошибка при отправке сообщения");
        }
      } catch (err) {
        console.error("Ошибка:", err);
      }
    });
  }

  // Функция открытия кейса (вызывается по кнопке «Открыть кейс»)
  function openCase(caseName) {
    // Ищем модальное окно, которое должно быть в шаблоне с id="case-modal"
    const modal = document.getElementById("case-modal");
    if (!modal) {
      console.error("Модальное окно openCase не найдено");
      return;
    }
    // Показываем модалку
    modal.style.display = "flex";

    // Имитация анимации открытия кейса (3 секунды)
    setTimeout(() => {
      fetch('/cases/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseName })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Поздравляем, вы получили: " + data.item.name);
          // Здесь можно обновлять инвентарь или баланс пользователя, если требуется.
        } else {
          alert("Ошибка: " + data.message);
        }
        modal.style.display = 'none';
      })
      .catch(err => {
        console.error(err);
        modal.style.display = 'none';
      });
    }, 3000);
  }

  // Функция продажи скина (вызывается по нажатию кнопки «Продать» в инвентаре)
  function sellSkin(id, name, image, price) {
    // Декодирование значений, если они были закодированы
    name = decodeURIComponent(name);
    image = decodeURIComponent(image);

    // Заполнение полей модалки продажи (которая должна быть на странице, например, inventory.ejs)
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalImage').alt = name;
    document.getElementById('modalPrice').textContent = price + ' коины';

    // Заполнение скрытых полей формы
    document.getElementById('formId').value = id;
    document.getElementById('formName').value = name;
    document.getElementById('formImage').value = image;
    document.getElementById('formPrice').value = price;

    // Показываем модалку продажи
    const sellModal = document.getElementById('sellModal');
    if (sellModal) {
      sellModal.style.display = 'flex';
    } else {
      console.error('Модальное окно продажи не найдено');
    }
  }

  // Функция закрытия модалки продажи
  function closeModal() {
    const sellModal = document.getElementById('sellModal');
    if (sellModal) {
      sellModal.style.display = 'none';
    } else {
      console.error('Модальное окно продажи не найдено');
    }
  }

  // Привязка обработчиков кнопок модалки для продажи (если кнопки с классами .btn-coins и .btn-market есть на странице)
  const btnCoins = document.querySelector('.btn-coins');
  const btnMarket = document.querySelector('.btn-market');

  if (btnCoins) {
    btnCoins.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = document.getElementById('formId').value;
      try {
        const res = await fetch('/inventory/confirm-sell', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action: 'coins' })
        });
        const data = await res.json();
        if (data.success) {
          alert('Скин продан за коины!');
          location.reload();
        } else {
          alert('Ошибка при продаже!');
        }
      } catch (err) {
        console.error(err);
        alert('Произошла ошибка!');
      }
    });
  }

  if (btnMarket) {
    btnMarket.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = document.getElementById('formId').value;
      try {
        const res = await fetch('/market/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          alert('Скин выставлен на маркет!');
          location.reload();
        } else {
          alert('Ошибка при выставлении на продажу!');
        }
      } catch (err) {
        console.error(err);
        alert('Произошла ошибка!');
      }
    });
  }

  // Экспортируем функции в глобальную область, чтобы их можно было вызвать из HTML (например, через onclick)
  window.openCase = openCase;
  window.sellSkin = sellSkin;
  window.closeModal = closeModal;

  // Подсветка активных ссылок в навигации
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
});


<script src="/js/main.js"></script>
