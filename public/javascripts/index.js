const flip = () => {
  let card = document.querySelector('.card');
  let flipButton = document.querySelector('.button-flip');
  flipButton.addEventListener('click', function () {
    card.classList.toggle('is-flipped');
    console.log(card.classList.value);
    if (card.classList.value === 'card') {
      flipButton.innerHTML = `<p>Mostrar lista</p>`;
    } else {
      flipButton.innerHTML = `<p>Mostrar mapa</p>`;
    }
  });
};

window.addEventListener('load', flip);
