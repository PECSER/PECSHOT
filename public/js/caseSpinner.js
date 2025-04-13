const caseSkins = {
  'AWP Case': [
    { name: 'AWP | Asiimov', image: '/images/skins/awp_asiimov.png' },
    { name: 'AWP | Dragon Lore', image: '/images/skins/awp_dragonlore.png' },
    { name: 'AWP | Hyper Beast', image: '/images/skins/awp_hyperbeast.png' },
  ],
  'AK-47 Case': [
    { name: 'AK-47 | Redline', image: '/images/skins/ak_redline.png' },
    { name: 'AK-47 | Fire Serpent', image: '/images/skins/ak_fire_serpent.png' },
  ],
  'Free Starter Case': [
    { name: 'Glock-18 | Candy Apple', image: '/images/skins/glock_candy_apple.png' },
    { name: 'USP-S | Forest Leaves', image: '/images/skins/usp_forest.png' },
  ],
};

function openCase(caseName) {
  const modal = document.getElementById('case-modal');
  const container = modal.querySelector('.case-items');
  const skinList = modal.querySelector('.skin-list');
  const caseImage = modal.querySelector('.big-case-image');
  const spinSound = document.getElementById('spin-sound');
  const winSound = document.getElementById('win-sound');

  modal.classList.add('show');
  container.innerHTML = '';
  skinList.innerHTML = '';

  // Путь до изображения кейса
  const imageName = caseName.replaceAll(' ', '_').replaceAll('|', '').toLowerCase();
  caseImage.src = `/images/cases/${imageName}.png`;

  const skins = caseSkins[caseName] || [];

  // Показ списка скинов
  skins.forEach(skin => {
    const div = document.createElement('div');
    div.className = 'skin-preview';
    div.innerHTML = `
      <img src="${skin.image}" alt="${skin.name}">
      <p style="color: white; font-size: 12px;">${skin.name}</p>
    `;
    skinList.appendChild(div);
  });

  // Создание ленты кейса
  const roll = [];
  for (let i = 0; i < 30; i++) {
    const item = skins[Math.floor(Math.random() * skins.length)] || { name: '???', image: '/images/skins/sample.png' };
    roll.push(item);

    const div = document.createElement('div');
    div.className = 'case-item';
    div.innerHTML = `<img src="${item.image}" alt="${item.name}" title="${item.name}">`;
    container.appendChild(div);
  }

  // Аудио
  spinSound.currentTime = 0;
  spinSound.play();

  // Старт анимации прокрутки
  container.scrollTo({ left: 0 });
  setTimeout(() => {
    container.scrollTo({
      left: 120 * 15,
      behavior: 'smooth'
    });
  }, 100);

  // Выпадение дропа
  setTimeout(() => {
    spinSound.pause();
    winSound.play();

    const dropped = roll[15];
    alert(`?? Вы выбили: ${dropped.name}`);
  }, 3000);
}

function closeModal() {
  const modal = document.getElementById('case-modal');
  modal.classList.remove('show');
}
