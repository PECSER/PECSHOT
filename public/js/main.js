// public/js/main.js � ������� ������ �����
document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js ���������������");

  // ������ ����������� ����� ��� ���� (���� ����)
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
          newMsg.textContent = `��: ${message}`;
          chatBox.appendChild(newMsg);
          messageInput.value = "";
        } else {
          alert("������ ��� �������� ���������");
        }
      } catch (err) {
        console.error("������:", err);
      }
    });
  }

  // ������� �������� ����� (���������� �� ������ �������� ����)
  function openCase(caseName) {
    // ���� ��������� ����, ������� ������ ���� � ������� � id="case-modal"
    const modal = document.getElementById("case-modal");
    if (!modal) {
      console.error("��������� ���� openCase �� �������");
      return;
    }
    // ���������� �������
    modal.style.display = "flex";

    // �������� �������� �������� ����� (3 �������)
    setTimeout(() => {
      fetch('/cases/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseName })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("�����������, �� ��������: " + data.item.name);
          // ����� ����� ��������� ��������� ��� ������ ������������, ���� ���������.
        } else {
          alert("������: " + data.message);
        }
        modal.style.display = 'none';
      })
      .catch(err => {
        console.error(err);
        modal.style.display = 'none';
      });
    }, 3000);
  }

  // ������� ������� ����� (���������� �� ������� ������ ��������� � ���������)
  function sellSkin(id, name, image, price) {
    // ������������� ��������, ���� ��� ���� ������������
    name = decodeURIComponent(name);
    image = decodeURIComponent(image);

    // ���������� ����� ������� ������� (������� ������ ���� �� ��������, ��������, inventory.ejs)
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalImage').alt = name;
    document.getElementById('modalPrice').textContent = price + ' �����';

    // ���������� ������� ����� �����
    document.getElementById('formId').value = id;
    document.getElementById('formName').value = name;
    document.getElementById('formImage').value = image;
    document.getElementById('formPrice').value = price;

    // ���������� ������� �������
    const sellModal = document.getElementById('sellModal');
    if (sellModal) {
      sellModal.style.display = 'flex';
    } else {
      console.error('��������� ���� ������� �� �������');
    }
  }

  // ������� �������� ������� �������
  function closeModal() {
    const sellModal = document.getElementById('sellModal');
    if (sellModal) {
      sellModal.style.display = 'none';
    } else {
      console.error('��������� ���� ������� �� �������');
    }
  }

  // �������� ������������ ������ ������� ��� ������� (���� ������ � �������� .btn-coins � .btn-market ���� �� ��������)
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
          alert('���� ������ �� �����!');
          location.reload();
        } else {
          alert('������ ��� �������!');
        }
      } catch (err) {
        console.error(err);
        alert('��������� ������!');
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
          alert('���� ��������� �� ������!');
          location.reload();
        } else {
          alert('������ ��� ����������� �� �������!');
        }
      } catch (err) {
        console.error(err);
        alert('��������� ������!');
      }
    });
  }

  // ������������ ������� � ���������� �������, ����� �� ����� ���� ������� �� HTML (��������, ����� onclick)
  window.openCase = openCase;
  window.sellSkin = sellSkin;
  window.closeModal = closeModal;

  // ��������� �������� ������ � ���������
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
});


<script src="/js/main.js"></script>
