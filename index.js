;(function () {
  const getRandomRoute = () => {
    const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    const routes = ['success', 'error', 'progress'];

    return routes[getRandom(0, routes.length - 1)];
  };

  class Form {
    constructor() {
      this.myFormElement = document.getElementById('myForm');

      this.myFormElement.addEventListener('submit', element => (element.preventDefault(), this.submit()));
    }

    sendData() {
      let resolve = null;
      const readyPromise = new Promise((r) => { resolve = r });

      const send = (localeRoute = getRandomRoute(), reolve) => {
        fetch(`./fake-api/${localeRoute}.json`, {
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

      send(undefined, resolve);

      return readyPromise;
    }

    setResponse(addedClass, message) {
      this.myFormElement.classList.add(addedClass);

      resultContainer.innerText = message;
    }

    validate() {
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
        const inputValue = this.myFormElement[input].value;
        const isValidInput = validators[input](inputValue);

        if (!isValidInput) {
          errorFields.push(input);
        }

        return errorFields;
      }, []);

      return { isValid: !errorFields.length, errorFields };
    }

    getData() {
      return ['fio', 'email', 'phone'].reduce((data, inputName) => {
        return Object.assign(data, { [inputName]: this.myFormElement[inputName].value });
      }, {});
    }

    setData(data) {
      ['fio', 'email', 'phone'].forEach((inputName) => {
        if (data[inputName] === undefined) {
          throw new Error(`Incorrect data. Required record ${inputName}!`);
        }

        this.myFormElement[inputName].value = data[inputName];
      });
    }

    submit() {
      // Clear form
      ['success', 'error'].forEach(deletedClass => this.myFormElement.classList.remove(deletedClass));

      ['fio', 'email', 'phone'].forEach((inputName) => {
        this.myFormElement[inputName].classList.remove('error');
      });

      this.myFormElement.submitButton.removeAttribute('disabled');

      resultContainer.innerText = '';

      // Validate
      const { isValid, errorFields } = this.validate();

      errorFields.forEach((inputName) => {
        this.myFormElement[inputName].classList.add('error');
      });

      if (!isValid) {
        return;
      }

      // Send data
      this.myFormElement.submitButton.setAttribute('disabled', '');

      this.sendData()
        .then(({ status, message = 'Success' }) => {
          this.setResponse(status, message);

          this.myFormElement.submitButton.removeAttribute('disabled');
        });
    }
  };

  const { validate, getData, setData, submit } = new Form();

  window.myForm = { validate, getData, setData, submit };
})();
