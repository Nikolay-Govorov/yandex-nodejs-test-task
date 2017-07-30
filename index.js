/*
 * Circuit need that would be in global
 * scope was just the right methods
 * */
(function () {
  const DISABLED = 'disabled'; // html attribute

  const getRandom = (min, max) => Math.floor((Math.random() * ((max - min) + 1)) + min);

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

    // must be overridden
    isValid() {} // eslint-disable-line class-methods-use-this
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

      return address.match(/[\\/"':;(),]/ig) === null;
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
    constructor({ form, resultContainer, CSSClasses }) {
      this.form = form;
      this.classes = CSSClasses;
      this.resultContainer = resultContainer;

      this.inputs = {
        fio: new FIOInput(this.form.fio),
        email: new EmailInput(this.form.email),
        phone: new PhoneInput(this.form.phone),
      };

      this.form.addEventListener('submit', element => ((element.preventDefault(), this.submit())));
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

    getAction() {
      if (this.form.hasAttribute('action')) {
        return this.form.getAttribute('action');
      }

      // Fake action
      const fakeRoutes = ['success', 'error', 'progress'];

      const randomRoute = fakeRoutes[getRandom(0, fakeRoutes.length - 1)];

      return `./fake-api/${randomRoute}.json`;
    }

    fetch() {
      let resolve = null;

      const action = () => this.getAction();
      const formData = Object.assign({}, this.data);

      (function send() {
        window.fetch(action(), {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' },
        })
          .then(response => response.json())
          .then((data) => {
            if (data.status === 'progress') {
              setTimeout(send, data.timeout); return;
            }

            if (data.status === 'error') {
              resolve(({ status: 'error', message: data.reason })); return;
            }

            resolve(({ status: 'success' }));
          });
      }());

      return new Promise((r) => { resolve = r; });
    }

    validate() {
      const errorFields = Object.keys(this.inputs).reduce((fields, input) => {
        const isValidInput = this.inputs[input].isValid();

        if (!isValidInput) {
          fields.push(input);
        }

        return fields;
      }, []);

      return { isValid: !errorFields.length, errorFields };
    }

    submit() {
      if (this.form.submitButton.hasAttribute(DISABLED)) {
        return;
      }

      // (1) Clear form
      Object.keys(this.classes.input)
        .forEach(deletedClass => this.form.classList.remove(deletedClass));

      Object.keys(this.inputs).forEach((inputName) => {
        this.form[inputName].classList.remove(this.classes.input.error);
      });

      this.form.submitButton.removeAttribute(DISABLED);

      this.resultContainer.innerText = '';

      // (2) Validate
      const { isValid, errorFields } = this.validate();

      errorFields.forEach((inputName) => {
        this.form[inputName].classList.add(this.classes.input.error);
      });

      if (!isValid) {
        return;
      }

      // (3) Send data
      this.form.submitButton.setAttribute(DISABLED, DISABLED);

      this.fetch().then(({ status, message = 'Success' }) => {
        if (this.classes.form[status]) {
          this.form.classList.add(this.classes.form[status]);
        }

        this.resultContainer.innerText = message;

        this.form.submitButton.removeAttribute(DISABLED);
      });
    }
  }

  // Public methods
  const form = new Form({
    CSSClasses: {
      form: { error: 'error' },
      input: { error: 'error', success: 'success' },
    },
    form: document.getElementById('myForm'),
    resultContainer: document.getElementById('resultContainer'),
  });

  window.MyForm = {
    submit: form.submit.bind(form),
    validate: form.validate.bind(form),
    getData: () => form.data,
    setData: (newData) => { form.data = newData; },
  };
}());
