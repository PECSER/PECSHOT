document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.case-items');
  const spinSound = document.getElementById('spin-sound');
  const winSound = document.getElementById('win-sound');

  const roll = [];

  for (let i = 0; i < 30; i++) {
    const item = caseSkins[Math.floor(Math.random() * caseSkins.length)];
    roll.push(item);

    const div = document.createElement('div');
    div.className = 'case-item';
    div.innerHTML = `<img src="${item.image}" alt="${item.name}" title="${item.name}">`;
    container.appendChild(div);
  }

  container.scrollTo({ left: 0 });
  spinSound.play();

  setTimeout(() => {
    container.scrollTo({
      left: 120 * 15,
      behavior: 'smooth'
    });
  }, 100);

  setTimeout(() => {
    spinSound.pause();
    winSound.play();
    const dropped = roll[15];
    alert(`?? Вы выбили: ${dropped.name}`);
  }, 3000);
});
