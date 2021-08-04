const ALERT_SHOW_TIME = 5000;

const getRandomIntNumber = (bottom, top) => {
  const min = Math.ceil(Math.min(bottom, top));
  const max = Math.floor(Math.max(bottom, top));
  const result = Math.abs(Math.floor(Math.random() * (max - min + 1)) + min); //Максимум и минимум включаются
  return result;
};

const getRandomFloatNumber = (bottom, top, roundUp = 5) => {
  const min = Math.min(bottom, top);
  const max = Math.max(bottom, top);
  const result = Math.abs(Math.random() * (max - min) + min); //Максимум и минимум включаются
  return result.toFixed(roundUp);
};

const getRandomArrayElement = (elements) => {
  return elements[getRandomIntNumber(0, elements.length - 1)];
};

const getNoRepeatElements = (elements) => {
  return elements.filter(() => Math.random() > 0.5);
};

const goToInactiveState = (filters, adForm, fieldsets, filterItem) => {
  filters.classList.add('map__filters--disabled');
  adForm.classList.add('ad-form--disabled');

  fieldsets.forEach((el) => {
    el.disabled = true;
  });

  filterItem.forEach((el) => {
    el.disabled = true;
  });
};

const goToInactiveFiltersState = (filters, filterItem) => {
  filters.classList.add('map__filters--disabled');
  filterItem.forEach((el) => {
    el.disabled = true;
  });
}

const goToActiveState = (filters, adForm, fieldsets, filterItem) => {
  filters.classList.remove('map__filters--disabled');
  adForm.classList.remove('ad-form--disabled');

  fieldsets.forEach((el) => {
    el.disabled = false;
  });

  filterItem.forEach((el) => {
    el.disabled = false;
  });
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 1000;
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
}

const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

export {
  getRandomIntNumber,
  getRandomFloatNumber,
  getRandomArrayElement,
  getNoRepeatElements,
  goToInactiveState,
  goToActiveState,
  goToInactiveFiltersState,
  showAlert,
  isEscEvent
};
