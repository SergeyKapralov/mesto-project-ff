export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};


//показать ошибку
function showInputError (formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`#${inputElement.name}-input-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

//спрятать ошибку
function hideInputError (formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.name}-input-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
};

// Переключение состояния кнопки
function toggleButtonState (inputList, buttonElement, config) {
  const hasInvalidInput = inputList.some(input => !input.validity.valid);
  
  if (hasInvalidInput) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;   
  }
};

//проверка на валидность
function checkInputValidity (formElement, inputElement, config) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Установка обработчиков событий
function setEventListeners (formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// Включение валидации для всех форм
export function enableValidation (config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  
  formList.forEach(formElement => {
    setEventListeners(formElement, config);
  });
};


export function clearValidation(formElement, config) {
	const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);


  inputList.forEach(inputElement => {
    const errorElement = formElement.querySelector(`#${inputElement.name}-input-error`);
    if (errorElement) {
      hideInputError(formElement, inputElement, config);
    }
    inputElement.setCustomValidity(''); 
  });

  // Деактивируем кнопку
  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
}; 

