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
      return true;
    },

    phone(value) {
      return true;
    },
  };

  const errorFields = ['fio', 'email', 'phone'].reduce((errorFields, input) => {
    if (!validators[input](myForm[input].value)) {
      errorFields.push(input);
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
