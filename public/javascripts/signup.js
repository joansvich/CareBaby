'use strict';

const main = () => {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(hasLocation, error);
  }

  function hasLocation (position) {
    console.log('now');
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const inputLatitude = document.querySelector('.input-latitude');
    inputLatitude.value = latitude;
    const inputLongitude = document.querySelector('.input-longitude');
    inputLongitude.value = longitude;
  }

  function error (error) {
    console.log(error);
  }
};

window.addEventListener('load', main);
