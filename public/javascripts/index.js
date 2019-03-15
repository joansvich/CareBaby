
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
      console.log(darkmode);
      switch (darkmode) {
      case 'yes':
        localStorage.removeItem(darkmode);
        localStorage.setItem('darkmode', 'no');
        break;
      case 'no':
        localStorage.removeItem(darkmode);
        localStorage.setItem('darkmode', 'yes');
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
      // // Modificamos las propiedades

      // html.style.transition = 'all 1s ease';
      // html.style.background = 'rgb(50, 54, 56)';
      // body.style.transition = 'all 1s ease';
      // body.style.setProperty('--dark', '#999');
      // body.style.setProperty('--color-primary', '#3684a7');
      // cardsItem.forEach(card => {
      //   card.style.transition = 'all 1s ease';
      //   card.style.background = 'rgb(69, 75, 78)';
      // });
      // arrowContainer.style.transition = 'all 1s ease';
      // arrowContainer.style.background = 'rgb(84, 84, 84)';
      // arrowContainer.style.border = '1px solid rgb(84, 84, 84)';
      // arrowBg.style.transition = 'all 1s ease';
      // arrowBg.style.background = 'rgb(84, 84, 84)';
    }
    i++;
    console.log(i);
  };
  logo.addEventListener('click', darkMode);
};
window.addEventListener('load', index);
