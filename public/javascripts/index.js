
const index = () => {
  const checkbox = document.querySelector('.checkbox');
  const overlay = document.querySelector('.overlay');
  const localStorage = window.localStorage;

  const logo = document.querySelector('.logo');
  const unlockDarkMode = localStorage.getItem('unlockDarkMode');
  const darkmode = localStorage.getItem('darkmode');

  // darkmode
  const html = document.querySelector('html');
  const body = document.body;
  const cardsItem = document.querySelectorAll('.cards-item');
  const arrowContainer = document.querySelector('.arrow-container');
  const arrowBg = document.querySelector('.arrow-bg');
  const buttonDarkMode = document.querySelector('.js-button-dark-mode');
  // Menu
  const handleClick = (event) => {
    (event.target.checked) ? overlay.style.display = 'block' : overlay.style.display = 'none';
  };
  checkbox.addEventListener('click', handleClick);

  if (unlockDarkMode === 'yes') {
    buttonDarkMode.style.display = 'block';

    if (darkmode === 'yes') {
      body.setAttribute('class', 'darkmode');
    } else {
      body.removeAttribute('class');
    }

    // funció per anar canviant valor darkmode
    // s'executarà en cada click

    const toogleDarkMode = (event) => {
      const input = document.querySelector('.js-button-dark-mode input');
      switch (darkmode) {
      case 'yes':
        localStorage.removeItem(darkmode);
        localStorage.setItem('darkmode', 'no');
        input.checked = false;
        window.location.href = '/';
        break;
      case 'no':
        localStorage.removeItem(darkmode);
        localStorage.setItem('darkmode', 'yes');
        input.checked = true;
        window.location.href = '/';
        break;
      default:
        console.log('no entro');
      }
    };
    buttonDarkMode.addEventListener('click', toogleDarkMode);
  }

  // Dark mode
  let i = 0;
  const darkMode = (event) => {
    if (i === 10) {
      body.setAttribute('class', 'darkmode');
      localStorage.setItem('unlockDarkMode', 'yes');
      localStorage.setItem('darkmode', 'yes');
      buttonDarkMode.style.display = 'block';

      // DOM para transition

      // // Modificamos las propiedades

      html.style.transition = 'all 1s ease';

      body.style.transition = 'all 1s ease';

      cardsItem.forEach(card => {
        card.style.transition = 'all 1s ease';
      });
      arrowContainer.style.transition = 'all 1s ease';

      arrowBg.style.transition = 'all 1s ease';
    }
    i++;
    console.log(i);
  };
  logo.addEventListener('click', darkMode);
};
window.addEventListener('load', index);
