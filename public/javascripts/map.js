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
      // add marker to map
      new mapboxgl.Marker({
        color: 'red',
        offset: {
          x: -20,
          y: -20
        }
      })
        .setLngLat(babysitter.location.coordinates)
        .addTo(map);
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.

    arrayBabysitters.on('click', 'places', function (e) {
      var coordinates = e.location.coordinates.slice();
      var description = e.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
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
