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
  const switchDisplay = document.querySelector('.js-display-switch');
  const input = document.querySelector('.js-button-dark-mode input');
  // Menu
  const handleClick = (event) => {
    (event.target.checked) ? overlay.style.display = 'block' : overlay.style.display = 'none';
  };
  checkbox.addEventListener('click', handleClick);

  if (unlockDarkMode === 'yes') {
    switchDisplay.style.display = 'block';

    if (darkmode === 'yes') {
      body.setAttribute('class', 'darkmode');
      input.checked = true;
    } else {
      body.removeAttribute('class');
      input.checked = false;
    }

    // funció per anar canviant valor darkmode
    // s'executarà en cada click
    const toogleDarkMode = (event) => {
      switch (darkmode) {
      case 'yes': setDarkMode('no');
        break;
      case 'no': setDarkMode('yes');
        break;
      }
    };
    buttonDarkMode.addEventListener('click', toogleDarkMode);
  }

  const setDarkMode = (newSetting) => {
    localStorage.setItem('darkmode', newSetting);
    input.checked = !input.checked;
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  };

  // Dark mode
  let i = 0;
  const darkMode = (event) => {
    if (i === 10) {
      body.setAttribute('class', 'darkmode');
      localStorage.setItem('unlockDarkMode', 'yes');
      localStorage.setItem('darkmode', 'yes');
      switchDisplay.style.display = 'block';
      input.checked = true;
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
  };
  logo.addEventListener('click', darkMode);
};
window.addEventListener('load', index);
