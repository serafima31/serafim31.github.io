const LOWER_PRICE_RANGE = 0;
const UPPER_PRICE_RANGE = 50000;
const MIDDLE_PRICE_RANGE = 10000;

const HOUSE_TYPE_SETTINGS = {
  0: ['flat', 'palace', 'house', 'bungalow'],
  1: ['palace'],
  2: ['flat'],
  3: ['house'],
  4: ['bungalow'],
};

const ROOMS_SETTINGS = {
  0: [],
  1: [1],
  2: [2],
  3: [3],
};

const GUEST_SETTINGS = {
  0: [],
  1: [2],
  2: [1],
  3: [0],
};
const maxLimit = 150;

const filtersForm = document.querySelector('.map__filters');
const filterHouseType = document.querySelector('#housing-type');
const filterPrice = document.querySelector('#housing-price');
const filterRooms = document.querySelector('#housing-rooms');
const filterGuests = document.querySelector('#housing-guests');
const filterFeaturesList = document.querySelector('#housing-features');

let minNumberOfRooms = 0;
let minNumberOfGuest = 0;

while(minNumberOfRooms <= maxLimit) {
  ROOMS_SETTINGS[0].push(minNumberOfRooms++);
}

while(minNumberOfGuest <= maxLimit) {
  GUEST_SETTINGS[0].push(minNumberOfGuest++);
}

const checkHouseType = (object) => HOUSE_TYPE_SETTINGS[filterHouseType.selectedIndex].includes(object.offer.type);

const checkPrice = (object) => {
  switch (filterPrice.selectedIndex) {
    case 0:
      return (object.offer.price >= LOWER_PRICE_RANGE);
    case 1:
      return (object.offer.price >= MIDDLE_PRICE_RANGE && object.offer.price <= UPPER_PRICE_RANGE);
    case 2:
      return (object.offer.price < MIDDLE_PRICE_RANGE && object.offer.price >= LOWER_PRICE_RANGE);
    case 3:
      return (object.offer.price > UPPER_PRICE_RANGE);
  }
};

const checkRooms = (object) => ROOMS_SETTINGS[filterRooms.selectedIndex].includes(object.offer.rooms);

const checkGuests = (object) => GUEST_SETTINGS[filterGuests.selectedIndex].includes(object.offer.guests);

const changeElement = (cb) => {
  filtersForm.addEventListener('change', () => {
    cb();
  })
};

const checkFeatures = (object) => {
  const checkedFeatures = Array.from(filterFeaturesList.querySelectorAll('input:checked'));
  return checkedFeatures.every((item) => {
    return object.offer.features.some((feature) => {
      return feature === item.value;
    });
  });
};

export {
  checkHouseType,
  checkPrice,
  changeElement,
  checkRooms,
  checkGuests,
  checkFeatures
};
