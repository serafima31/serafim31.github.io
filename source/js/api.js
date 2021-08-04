const URL_DATA = './db/log.json';
const URL_SERVER = 'https://22.javascript.pages.academy/keksobooking';

const getData = (url, onSuccess, onError) => {
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status}`);
    })
    .then((json) => {
      onSuccess(json);
    })
    .catch((err) => {
      onError(err);
    });
}

const sendData = (url, onSuccess, onError, body) => {
  fetch(url, {
    method: 'POST',
    body,
  })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError();
      }
    })
    .catch(() => {
      onError();
    })
}

export {
  getData,
  sendData,
  URL_SERVER,
  URL_DATA
}
