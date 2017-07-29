;(function () {
  const getRandomRoute = () => {
    const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    const routes = ['success', 'error', 'progress'];

    return routes[getRandom(0, routes.length - 1)];
  };

  class Input {
    constructor(DOMElement) {
      this.element = DOMElement;
    }

    get value() {
      return this.element.value;
    }

    set value(value) {
      this.element.value = value;
    }

    isValid() {}
  }

  class FIOInput extends Input {
    isValid() {
      const value = this.element.value;

      const fio = value.trim();

      const words = fio.split(' ').filter(el => el !== '');

      if (words.length !== 3) {
        return false;
      }

      return words.reduce((isValid, word) => {
        const wordPattern = /^[a-zа-яё]+$/i;

        if (!word || !wordPattern.test(word)) {
          return false;
        }

        return isValid;
      }, true);
    }
  }

  class EmailInput extends Input {
    isValid() {
      const value = this.element.value;

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

      return address.match(/[\\\/\"\'\:\;(),]/ig) === null;
    }
  }

  class PhoneInput extends Input {
    isValid() {
      const value = this.element.value;

      const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;

      if (!phonePattern.test(value)) {
        return false;
      }

      const summNumbers = value
        .replace(/\D+/ig, '')
        .split('')
        .map(number => parseInt(number, 10))
        .reduce((summ, number) => summ + number, 0);

      return summNumbers <= 30;
    }
  }

  class Form {
    constructor({ form, resultContainer }) {
      this.form = form;
      this.resultContainer = resultContainer;

      this.inputs = {
        fio: new FIOInput(this.form.fio),
        email: new EmailInput(this.form.email),
        phone: new PhoneInput(this.form.phone),
      };

      this.form.addEventListener('submit', element => (element.preventDefault(), this.submit()));
    }

    get data() {
      return Object.keys(this.inputs)
        .reduce((data, input) => Object.assign(data, { [input]: this.inputs[input].value }), {});
    }

    set data(data) {
      Object.keys(this.inputs).forEach((inputName) => {
        if (data[inputName] === undefined) {
          return;
        }

        this.form[inputName].value = data[inputName];
      });
    }

    fetch() {
      let resolve = null;
      const readyPromise = new Promise((r) => { resolve = r });

      const send = (localeRoute = getRandomRoute(), reolve) => {
        window.fetch(`./fake-api/${localeRoute}.json`, {
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

    validate() {
      const errorFields = Object.keys(this.inputs).reduce((errorFields, input) => {
        const inputValue = this.form[input].value;
        const isValidInput = this.inputs[input].isValid();

        if (!isValidInput) {
          errorFields.push(input);
        }

        return errorFields;
      }, []);

      return { isValid: !errorFields.length, errorFields };
    }

    submit() {
      // Clear form
      ['success', 'error'].forEach(deletedClass => this.form.classList.remove(deletedClass));

      Object.keys(this.inputs).forEach((inputName) => {
        this.form[inputName].classList.remove('error');
      });

      this.form.submitButton.removeAttribute('disabled');

      this.resultContainer.innerText = '';

      // Validate
      const { isValid, errorFields } = this.validate();

      errorFields.forEach((inputName) => {
        this.form[inputName].classList.add('error');
      });

      if (!isValid) {
        return;
      }

      // Send data
      this.form.submitButton.setAttribute('disabled', '');

      this.fetch()
        .then(({ status, message = 'Success' }) => {
          this.form.classList.add(status);

          this.resultContainer.innerText = message;

          this.form.submitButton.removeAttribute('disabled');
        });
    }
  }

  // Public methods
  const form = new Form({
    form: document.getElementById('myForm'),
    resultContainer: document.getElementById('resultContainer'),
  });

  window.myForm = {
    submit: form.submit,
    validate: form.validate,
    getData: () => form.data,
    setData: (newData) => { form.data = newData },
  };
})();
