// Функция открытия модального окна
export function openModal(popup) {
  if (popup) {
    popup.classList.add("popup_is-opened");
  }
}

// Функция закрытия модального окна
export function closeModal(popup) {
  if (popup) {
    popup.classList.remove("popup_is-opened");
  }
}
