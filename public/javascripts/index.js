const index = () => {
  let checkbox = document.querySelector('.checkbox');
  let overlay = document.querySelector('.overlay');
  console.log(checkbox);
  checkbox.addEventListener('click', (click) => {
    if (click.currentTarget.checked) {
      overlay.style.width = '100%';
    } else {
      overlay.style.width = '0';
    }
  });
};

window.addEventListener('load', index);
