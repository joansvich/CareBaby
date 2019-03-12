const index = () => {
  const checkbox = document.querySelector('.checkbox');
  const overlay = document.querySelector('.overlay');

  const map = document.querySelector('.map-container');
  const mapArrow = document.querySelector('.arrow-toggle');

  // Menu
  const handleClick = (event) => {
    (event.target.checked) ? overlay.style.display = 'block' : overlay.style.display = 'none';
  };
  checkbox.addEventListener('click', handleClick);

  // Toggle map
  const handleClickToggleMap = (event) => {
    if (event.target) {
      map.classList.toggle('toggle');
      mapArrow.classList.toggle('rotate');
    }
  };
  map.addEventListener('click', handleClickToggleMap);
};
window.addEventListener('load', index);
