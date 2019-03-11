const index = () => {
  let checkbox = document.querySelector('.checkbox');
  let overlay = document.querySelector('.overlay');

  const handleClick = (event) => {
    (event.target.checked) ? overlay.style.display = 'block' : overlay.style.display = 'none';
  };

  checkbox.addEventListener('click', handleClick);
};

window.addEventListener('load', index);
