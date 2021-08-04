const createAdCard = (offersItem) => {
  const cardTemplate = document.querySelector('#card').content;
  const newCardTemplate = cardTemplate.querySelector('.popup');
  const card = newCardTemplate.cloneNode(true);

  const offerTitle = card.querySelector('.popup__title');
  const offerAddress = card.querySelector('.popup__text--address');
  const offerPrice = card.querySelector('.popup__text--price');
  const offerType = card.querySelector('.popup__type');
  const offerCapacity = card.querySelector('.popup__text--capacity');
  const offerTime = card.querySelector('.popup__text--time');
  const offerFeatures = card.querySelector('.popup__features');
  const featureList = offersItem.offer.features;
  const offerDescription = card.querySelector('.popup__description');
  const offerPhotos = card.querySelector('.popup__photos');
  const offerAvatar = card.querySelector('.popup__avatar');

  offerTitle.textContent = offersItem.offer.title;
  offerAddress.textContent = offersItem.offer.address; // Вывод координат
  offerPrice.textContent = offersItem.offer.price + ' ₽/ночь';

  switch (offersItem.offer.type) {
    case 'palace':
      offerType.textContent = 'Дворец';
      break;
    case 'flat':
      offerType.textContent = 'Квартира';
      break;
    case 'house':
      offerType.textContent = 'Дом';
      break;
    case 'bungalow':
      offerType.textContent = 'Бунгало';
      break;
  }

  offerCapacity.textContent = offersItem.offer.rooms + ' комнаты для ' + offersItem.offer.guests + ' гостей'; // Вывод типа жилья, проверенный чз switch
  offerTime.textContent = 'Заезд после ' + offersItem.offer.checkin + ', выезд до ' + offersItem.offer.checkout;

  const featureFragment = document.createDocumentFragment();
  offerFeatures.innerHTML = ''; // Очистил в шаблоне контейнер с 'удобствами'

  if (featureList.length === 0) {
    offerFeatures.classList.add('hidden');
  }

  featureList.forEach((feature) => {
    // Вывод фич в очищенный контейнер
    const offerFeatureItem = document.createElement('li');
    offerFeatureItem.classList.add('popup__feature', 'popup__feature--' + feature);
    featureFragment.appendChild(offerFeatureItem);
    offerFeatures.appendChild(featureFragment)
  });

  offerDescription.textContent = offersItem.offer.description;

  const photosFragment = document.createDocumentFragment();
  offerPhotos.innerHTML = ''; // Очистил в шаблоне контейнер с фотографиями жилья
  const photoSrc = offersItem.offer.photos;

  for (let i = 0; i < photoSrc.length; i++) {
    // Вывод фотографий в очищенный контейнер
    const offerPhotoItem = document.createElement('img');
    offerPhotoItem.classList.add('popup__photo');
    offerPhotoItem.width = 40;
    offerPhotoItem.height = 40;
    offerPhotoItem.src = photoSrc[i];
    photosFragment.appendChild(offerPhotoItem);
    offerPhotos.appendChild(photosFragment);
  }

  offerAvatar.src = offersItem.author.avatar;

  return card;
};

export { createAdCard };
