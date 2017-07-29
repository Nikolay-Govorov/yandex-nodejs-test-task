const myForm = document.getElementById('myForm');

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
      if (value.match(/ /ig) !== null || value.match(/@/ig).length !== 1) {
        return false;
      }

      const [address, host] = value.split('@');

      const allowedHosts = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];

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
      const phonePattern = /^\+\d\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;

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
    if (!validators[input](myForm[input].value)) {
      errorFields.push(input);
    }

    if (input === 'email') {
      console.log(validators[input](myForm[input].value));
    }

    return errorFields;
  }, []);

  return { isValid: !errorFields.length, errorFields };
};

function getData() {};

function setData(data) {};

const submit = () => {
  const { isValid, errorFields } = validate();

  errorFields.forEach((input) => {
    myForm[input].classList.add('error');
  });

  console.log('Submit');
};

myForm.addEventListener('submit', element => (element.preventDefault(), submit()));

window.myForm = { validate, getData, setData, submit };
