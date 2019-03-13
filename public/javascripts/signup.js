'use strict';

const main = () => {
  const hasLocation = async (position) => {
    try {
      const inputLocation = document.querySelector('.input-location');
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      let loc = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=place&limit=1&access_token=pk.eyJ1IjoiY2FyZWJhYnkiLCJhIjoiY2p0MWNrOHplMHBhdTRibXh3aXRsNDk4cCJ9.zeNJPvVOdrinJmH7mxLO3w`);
      const arrayLoc = await loc.json();
      inputLocation.value = arrayLoc.features[0].text;

      const inputLatitude = document.querySelector('.input-latitude');
      inputLatitude.value = latitude;
      const inputLongitude = document.querySelector('.input-longitude');
      inputLongitude.value = longitude;
    } catch (error) {

    }
  };

  const error = (error) => {
    console.log(error);
  };
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(hasLocation, error);
  }
};

window.addEventListener('load', main);
