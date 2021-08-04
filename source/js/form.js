import {
  sendData,
  URL_SERVER
} from './api.js';
import {
  mainMarker,
  mainCoordinateLat,
  mainCoordinateLng,
  resetMarkers
} from './map.js';
import {
  loadImg,
  resetPreviewImg
} from './pictures-load.js';
import { isEscEvent } from './util.js';

const PALACE_MIN_PRICE = 10000;
const FLAT_MIN_PRICE = 1000;
const HOUSE_MIN_PRICE = 5000;
const BUNGALOW_MIN_PRICE = 0;
const DEFAULT_SRC_IMAGE = 'img/muffin-grey.svg';
const MIN_HEADLINE_LENGTH = 30;
const MAX_HEADLINE_LENGTH = 100;
const GUESTS_IN_ROOMS = { // Соответствие комнат и гостей по индексам
  0: [2],
  1: [1, 2],
  2: [0, 1, 2],
  3: [3],
};

const main = document.querySelector('main');
const filtersForm = document.querySelector('.map__filters');
const adForm = document.querySelector('.ad-form');
const housingType = adForm.querySelector('#type');
const priceForNight = adForm.querySelector('#price');
const addressValue = adForm.querySelector('#address');
const timeIn = adForm.querySelector('#timein');
const timeOut = adForm.querySelector('#timeout');
const formElementTime = adForm.querySelector('.ad-form__element--time');
const headlineInput = adForm.querySelector('#title');
const roomsInput = adForm.querySelector('#room_number');
const guestsInput = adForm.querySelector('#capacity');
const resetFormBtn = adForm.querySelector('.ad-form__reset');

const avatarFileChooser = adForm.querySelector('.ad-form__field input[type=file]');
const avatarPreview = adForm.querySelector('.ad-form-header__preview img');
const imgFileChoicer = adForm.querySelector('.ad-form__upload input[type=file]');
const imgPreview = adForm.querySelector('.ad-form__photo-preview');

const successTemplate = document.querySelector('#success ').content;
const newSuccessTemplate = successTemplate.querySelector('.success');
const successPopup = newSuccessTemplate.cloneNode(true);

const errorTemplate = document.querySelector('#error').content;
const newErrorTemplate = errorTemplate.querySelector('.error')
const errorPopup = newErrorTemplate.cloneNode(true);
const errorButton = errorPopup.querySelector('.error__button');

housingType.addEventListener('change', (evt) => {
  switch (evt.target.value) {
    case 'palace':
      priceForNight.value = '';
      priceForNight.placeholder = PALACE_MIN_PRICE;
      priceForNight.min = PALACE_MIN_PRICE;
      break;
    case 'flat':
      priceForNight.value = '';
      priceForNight.placeholder = FLAT_MIN_PRICE;
      priceForNight.min = FLAT_MIN_PRICE;
      break;
    case 'house':
      priceForNight.value = '';
      priceForNight.placeholder = HOUSE_MIN_PRICE;
      priceForNight.min = HOUSE_MIN_PRICE;
      break;
    case 'bungalow':
      priceForNight.value = '';
      priceForNight.placeholder = BUNGALOW_MIN_PRICE;
      priceForNight.min = BUNGALOW_MIN_PRICE;
      break;
  }
});

formElementTime.addEventListener('change', (evt) => {
  timeIn.value = evt.target.value;
  timeOut.value = evt.target.value;
});

headlineInput.addEventListener('input', (evt) => {
  const valueLength = evt.target.value.valueLength;

  if (valueLength < MIN_HEADLINE_LENGTH) {
    headlineInput.setCustomValidity('Еще ' + (MIN_HEADLINE_LENGTH - valueLength) +' симв.');
  } else if (valueLength > MAX_HEADLINE_LENGTH) {
    headlineInput.setCustomValidity('Удалите лишние ' + (valueLength - MAX_HEADLINE_LENGTH) +' симв.');
  } else {
    headlineInput.setCustomValidity('');
  }
  headlineInput.reportValidity();
});

const checkGuestsInRooms = () => {
  return GUESTS_IN_ROOMS[roomsInput.selectedIndex].includes(guestsInput.selectedIndex);
}


const onRoomsGuests = (evt) => {
  const valid = checkGuestsInRooms();
  if(valid) {
    evt.target.setCustomValidity('')
  } else {
    evt.target.setCustomValidity('Проверьте данные')
  }
  if (roomsInput.selectedIndex === 3 && guestsInput.selectedIndex === 3) {
    roomsInput.setCustomValidity('')
    guestsInput.setCustomValidity('')
  }
  evt.target.reportValidity();
}

roomsInput.addEventListener('change', onRoomsGuests);
guestsInput.addEventListener('change', onRoomsGuests);

const resetForm = () => {
  adForm.reset();
  filtersForm.reset();
  resetMarkers();
  resetPreviewImg(avatarPreview, DEFAULT_SRC_IMAGE);
  resetPreviewImg(imgPreview, DEFAULT_SRC_IMAGE);
  addressValue.value = `${mainCoordinateLat}, ${mainCoordinateLng}`;
  mainMarker.setLatLng([mainCoordinateLat, mainCoordinateLng]);
  housingType.value = 'flat';
  priceForNight.value = '';
  priceForNight.placeholder = '1000';
  timeIn.value = '12:00';
  timeOut.value = '12:00';
  roomsInput.value = '1';
  guestsInput.value = '1';
};

const onWindowClickSuccesPopup = () => {
  successPopup.remove()
  window.removeEventListener('click', onWindowClickSuccesPopup);
  window.removeEventListener('keydown', onSuccesPopupEscKeydown);
};

const onSuccesPopupEscKeydown = (evt) => {
  if (isEscEvent) {
    evt.preventDefault();
    successPopup.remove();
    window.removeEventListener('keydown', onSuccesPopupEscKeydown);
    window.removeEventListener('click', onWindowClickSuccesPopup);
  }
};

const showSuccess = () => {
  resetForm();
  main.appendChild(successPopup);
  window.addEventListener('click', onWindowClickSuccesPopup);
  window.addEventListener('keydown', onSuccesPopupEscKeydown);
};

const onWindowErrorPopupClick = () => {
  errorPopup.remove();
  window.removeEventListener('click', onWindowErrorPopupClick);
  window.removeEventListener('keydown', onErrorPopupEscKeydown);
};

const onErrorPopupEscKeydown = () => {
  if (isEscEvent) {
    errorPopup.remove();
    window.removeEventListener('keydown', onErrorPopupEscKeydown);
    window.removeEventListener('click', onWindowErrorPopupClick);
  }
};

const onErrorButtonClick = () => {
  errorPopup.remove();
  errorButton.removeEventListener('click', onErrorButtonClick);
};

const showError = () => {
  main.appendChild(errorPopup);
  window.addEventListener('click', onWindowErrorPopupClick);
  window.addEventListener('keydown', onErrorPopupEscKeydown);
  errorButton.addEventListener('click', onErrorButtonClick);
};

resetFormBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetForm();
})

adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const data = new FormData(evt.target);
  sendData(URL_SERVER, showSuccess, showError, data)
});

loadImg(avatarFileChooser, avatarPreview);
loadImg(imgFileChoicer, imgPreview);
