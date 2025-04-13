function openCase(caseName) {
  // Показываем модальное окно
  const modal = document.getElementById('case-modal');
  modal.style.display = 'flex';
  
  // Здесь можно добавить логику для динамического заполнения div.case-items,
  // имитируя анимацию прокрутки случайных скинов.
  // Для примера установим таймаут, после которого анимация закончится и обновится инвентарь.
  
  setTimeout(() => {
    // Отправляем POST-запрос для открытия кейса на сервере
    fetch('/cases/open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseName })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Поздравляем, вы получили: " + data.item.name);
        // Здесь можно обновить данные пользователя, например, баланс и инвентарь
      } else {
        alert("Ошибка: " + data.message);
      }
      modal.style.display = 'none';
    })
    .catch(err => {
      console.error(err);
      modal.style.display = 'none';
    });
  }, 3000); // Анимация длится 3 секунды
}
