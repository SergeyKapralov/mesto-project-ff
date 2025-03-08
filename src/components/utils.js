// Функция изменения текста кнопки submit
export function setButtonState(button, text, isDisabled) {
  button.textContent = text;
  button.disabled = isDisabled;
}
