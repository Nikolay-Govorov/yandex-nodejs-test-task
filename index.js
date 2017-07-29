const myFormElement = document.getElementById('myForm');

function validate() {
  // TODO: add validators
  const validators = {
    fio(value) {
      const fio = value.trim();

      const words = fio.split(' ').filter(el => el !== '');

      if (words.length !== 3) {
        return false;
      }

      const isValidWorlds = words.reduce((isValid, word) => {
        const wordPattern = /^[a-zа-яё]+$/i

        if (!word || !wordPattern.test(word)) {
          return false;
        }

        return isValid;
      }, true);

      return isValidWorlds;
    },

    email(value) {
      if (value.match(/ /ig) !== null) {
        return false;
      }

      const [address, host, ...unnecessary] = value.split('@');

      if (!address || !host || unnecessary.length > 0) {
        return false;
      }

      const allowedHosts = [
        'ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com',
      ];

      if (!allowedHosts.includes(host)) {
        return false;
      }

      const illegalСharacters = /[\\\/\"\'\:\;(),]/ig;

      if (address.match(illegalСharacters) !== null) {
        return false;
      }

      return true;
    },

    phone(value) {
      const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;

      if (!phonePattern.test(value)) {
        return false;
      }

      const summNumbers = value
        .replace(/\D+/ig, '')
        .split('')
        .map(number => parseInt(number, 10))
        .reduce((summ, number) => summ + number, 0);

      if (summNumbers > 30) {
        return false;
      }

      return true;
    },
  };

  const errorFields = ['fio', 'email', 'phone'].reduce((errorFields, input) => {
    const inputValue = myFormElement[input].value;
    const isValidInput = validators[input](inputValue);

    if (!isValidInput) {
      errorFields.push(input);
    }

    return errorFields;
  }, []);

  return { isValid: !errorFields.length, errorFields };
};

function getData() {
  return ['fio', 'email', 'phone'].reduce((data, inputName) => {
    return Object.assign(data, { [inputName]: myFormElement[inputName].value });
  }, {});
};

function setData(data) {
  ['fio', 'email', 'phone'].forEach((inputName) => {
    if (data[inputName] === undefined) {
      throw new Error(`Incorrect data. Required record ${inputName}!`);
    }

    myFormElement[inputName].value = data[inputName];
  });
};

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getRandomRoute = () => {
  const routes = ['success', 'error', 'progress'];

  return routes[getRandom(0, routes.length - 1)];
};

const sendFormData = (route = getRandomRoute()) => {
  let resolve = null;
  const readyPromise = new Promise((r) => { resolve = r });

  const send = (localeRoute, reolve) => {
    fetch(`./fake-api/${route}.json`, {
      method: 'GET',
      mode: 'no-cors',
    })
      .then(response => response.json())
      .then((data) => {
        if (data.status === 'progress') {
          setTimeout(send.bind(null, getRandomRoute(), resolve), data.timeout); return;
        }

        if (data.status === 'error') {
          resolve(({ status: 'error', message: data.reason })); return;
        }

        resolve(({ status: 'success' }));
      });
  };

  send(route, resolve);

  return readyPromise;
}

const setResponseForm = (addedClass, message) => {
  myFormElement.classList.add(addedClass);

  resultContainer.innerText = message;
};

const submit = () => {
  // Clear form
  ['success', 'error'].forEach(deletedClass => myFormElement.classList.remove(deletedClass));

  ['fio', 'email', 'phone'].forEach((inputName) => {
    myFormElement[inputName].classList.remove('error');
  });

  myFormElement.submitButton.removeAttribute('disabled');

  resultContainer.innerText = '';

  // Validate
  const { isValid, errorFields } = validate();

  errorFields.forEach((inputName) => {
    myFormElement[inputName].classList.add('error');
  });

  if (!isValid) {
    return;
  }

  // Send data
  myFormElement.submitButton.setAttribute('disabled', '');

  sendFormData()
    .then(({ status, message = 'Success' }) => {
      setResponseForm(status, message);

      myFormElement.submitButton.removeAttribute('disabled');
    });
};

myFormElement.addEventListener('submit', element => (element.preventDefault(), submit()));

const myForm = { validate, getData, setData, submit };

window.myForm = myForm;
