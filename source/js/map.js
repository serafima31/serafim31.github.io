/* global L:readonly */
/* global _:readonly */
import {
  goToInactiveState,
  goToActiveState,
  goToInactiveFiltersState,
  showAlert
} from './util.js';
import { createAdCard } from './similar-card.js';
import {
  getData,
  URL_DATA
} from './api.js';
import {
  checkHouseType,
  checkPrice,
  checkRooms,
  changeElement,
  checkGuests,
  checkFeatures
} from './filter.js';

const ROUND_UP = 5;
const MAP_SIZE = 13;
const PIN_SIZE = 42;
const MIDDLE_PIN_SIZE = 21;
const MAIN_PIN_SIZE = 52;
const MIDDLE_MAIN_PIN_SIZE = 26;
const OFFERS_COUNT = 10;
const FIRS_OFFERS_POSITION = 0;
const DEBOUNSE_DELAY = 500;

const adForm = document.querySelector('.ad-form');
const allFieldset = adForm.querySelectorAll('fieldset');
const mapFilters = document.querySelector('.map__filters');
const mapFilterChildren = mapFilters.children;
const mapFilterItems = Array.from(mapFilterChildren);
const addressValue = document.querySelector('#address');
const mainCoordinateLat = 35.68331;
const mainCoordinateLng = 139.7631;

const showError = () => {
  showAlert('Данные объявлений не загружены, попробуйте позже')
  goToInactiveFiltersState(mapFilters, mapFilterItems);
};

goToInactiveState(mapFilters, adForm, allFieldset, mapFilterItems);

const layerGroup = L.layerGroup();

const createAdMarkers = (offersList) => {
  offersList
    .slice()
    .filter((el) => checkHouseType(el) && checkPrice(el) && checkRooms(el) && checkGuests(el) && checkFeatures(el))
    .slice(FIRS_OFFERS_POSITION, OFFERS_COUNT)
    .forEach((offersItem) => {
      const pinIcon = L.icon({
        iconUrl: './img/pin.svg',
        iconSize: [PIN_SIZE, PIN_SIZE],
        iconAnchor: [MIDDLE_PIN_SIZE, PIN_SIZE],
      });
      const marker = L.marker(
        {
          lat: offersItem.location.lat,
          lng: offersItem.location.lng,
        },
        {
          icon: pinIcon,
        },
      );

      marker
        .addTo(layerGroup)
        .bindPopup(createAdCard(offersItem), {
          keepInView: true,
        });

      layerGroup.addTo(map);
    });
};

const resetMarkers = () => {
  layerGroup.remove();
  getData(
    URL_DATA,
    (offers) => {
      createAdMarkers(offers);
      changeElement(_.debounce(
        () => {
          layerGroup.clearLayers();
          createAdMarkers(offers);
        }, DEBOUNSE_DELAY))
    },
    showError,
  );
}

const map = L.map('map-canvas')
  .on('load', () => {
    goToActiveState(mapFilters, adForm, allFieldset, mapFilterItems);
    addressValue.readOnly = true;
    addressValue.value = `${mainCoordinateLat}, ${mainCoordinateLng}`;
    getData(
      URL_DATA,
      (offers) => {
        createAdMarkers(offers);
        changeElement(_.debounce(
          () => {
            layerGroup.clearLayers();
            createAdMarkers(offers);
          }, DEBOUNSE_DELAY))
      },
      showError,
    );
  })
  .setView(
    {
      lat: mainCoordinateLat,
      lng: mainCoordinateLng,
    }, MAP_SIZE);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [MAIN_PIN_SIZE, MAIN_PIN_SIZE],
  iconAnchor: [MIDDLE_MAIN_PIN_SIZE, MAIN_PIN_SIZE],
});

const mainMarker = L.marker(
  {
    lat: mainCoordinateLat,
    lng: mainCoordinateLng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainMarker.addTo(map);

mainMarker.on('moveend', (evt) => {
  const coordinateValue = evt.target.getLatLng();
  let coordinateLat = coordinateValue.lat;
  let coordinateLng = coordinateValue.lng;
  addressValue.value = `${coordinateLat.toFixed(ROUND_UP)}, ${coordinateLng.toFixed(ROUND_UP)}`;
});

export {
  mainMarker,
  mainCoordinateLat,
  mainCoordinateLng,
  resetMarkers
}
