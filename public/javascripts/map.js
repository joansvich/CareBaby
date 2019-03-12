'use strict';

const main = async () => {
  try {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FyZWJhYnkiLCJhIjoiY2p0MWNrOHplMHBhdTRibXh3aXRsNDk4cCJ9.zeNJPvVOdrinJmH7mxLO3w';
    const mapOptions = {
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.1577406, 41.387982],
      zoom: 13
    };

    const map = new mapboxgl.Map(mapOptions);

    const setLocationMarker = (locationArray) => {
      map.setCenter(locationArray);
      const marker = new mapboxgl.Marker({
        color: 'blue',
        offset: {
          x: -20,
          y: -20
        }
      })
        .setLngLat(locationArray)
        .addTo(map);

      map.setZoom(13);
    };

    const hasLocation = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setLocationMarker([longitude, latitude]);
    };

    const error = (error) => {
      console.log(error);
    };

    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(hasLocation, error);
    }

    // cogemos array de babysitters
    const arrayBabysitters = await searchBabysitters();

    arrayBabysitters.forEach(babysitter => {
      var el = document.createElement('div');
      el.className = 'marker';
      el.style.background = babysitter.imageUrl;

      new mapboxgl.Marker(el)
        .setLngLat(babysitter.location.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(`
          <div class="popup">
            <div class="popup-img">
              <div class="popup-img-avatar" style="background-image:url(${babysitter.imageUrl})"></div>
            </div>
            <div class="popup-details">
              <p class="popup-details-name"><a href="/profile/${babysitter._id}">${babysitter.username}</a></p>
              <p>Barcelona</p>
              <p>XXXXX</p>
            </div>
          </div>
          `))
        .addTo(map);
    });
  } catch (error) {

  }
};

const searchBabysitters = async () => {
  try {
    const babysitterRequest = await fetch(`/api/user`);
    if (babysitterRequest.status === 404) {
      console.log('No hay canguro');
      // const errorElement = document.querySelector('.error');
      // errorElement.style.visibility = 'visible';
    }
    const arrayBabysitters = await babysitterRequest.json();
    return arrayBabysitters;
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener('load', main);
