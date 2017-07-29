const myForm = document.getElementById('myForm');

function validate() {
  // TODO: add validators
  const validators = {
    fio(value) {
      return true;
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
