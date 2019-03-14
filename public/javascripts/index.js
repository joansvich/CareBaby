const index = () => {
  const checkbox = document.querySelector('.checkbox');
  const overlay = document.querySelector('.overlay');

  const arrow = document.querySelector('.arrow-slide-toogle');
  const map = document.querySelector('.map-container');
  const mapArrowImage = document.querySelector('.arrow-img');
  const mapText = document.querySelector('.map-text');
  const logo = document.querySelector('.logo');
  // Menu
  const handleClick = (event) => {
    (event.target.checked) ? overlay.style.display = 'block' : overlay.style.display = 'none';
  };
  checkbox.addEventListener('click', handleClick);

  // Toggle map
  const handleClickToggleMap = (event) => {
    if (event.target) {
      map.classList.toggle('toggle-map');
      mapArrowImage.classList.toggle('arrow-img--rotate');
      // Toggle text
      if (mapText.innerHTML === 'Ver mapa') {
        mapText.innerHTML = 'Ocultar mapa';
      } else if (mapText.innerHTML === 'Ocultar mapa') {
        mapText.innerHTML = 'Ver mapa';
      }
    }
  };
  arrow.addEventListener('click', handleClickToggleMap);

  // Dark mode
  let i = 0;
  const darkMode = (event) => {
    if (i === 10) {
      const html = document.querySelector('html');
      const cardsItem = document.querySelectorAll('.cards-item');
      const arrowContainer = document.querySelector('.arrow-container');
      const arrowBg = document.querySelector('.arrow-bg');

      // Modificamos las propiedades
      document.body.style.setProperty('--dark', '#999');
      html.style.background = 'rgb(50, 54, 56)';
      cardsItem.forEach(card => {
        card.style.background = 'rgb(69, 75, 78)';
      });
      arrowContainer.style.background = '#717171';
      arrowContainer.style.border = '1px solid #717171';
      arrowBg.style.background = '#717171';
    }
    i++;
    console.log(i);
  };
  logo.addEventListener('click', darkMode);
};
window.addEventListener('load', index);
