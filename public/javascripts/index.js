const index = () => {
  const checkbox = document.querySelector('.checkbox');
  const overlay = document.querySelector('.overlay');

  const arrow = document.querySelector('.arrow-slide-toogle');
  const map = document.querySelector('.map-container');
  const mapArrowImage = document.querySelector('.arrow-img');
  const mapText = document.querySelector('.map-text');

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
};
window.addEventListener('load', index);
