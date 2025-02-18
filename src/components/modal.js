let currentPopup = null;

export function openModal(popup) {
  if (currentPopup) closeModal(currentPopup);

  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscape);
  currentPopup = popup;
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscape);
  currentPopup = null;
}

function handleEscape(evt) {
  if (evt.key === "Escape" && currentPopup) {
    closeModal(currentPopup);
  }
}

// Обработчики событий для модальных окон
export function setModalWindowEventListeners(modalWindow) {
  const closeButton = modalWindow.querySelector(".popup__close");
  closeButton.addEventListener("click", () => closeModal(modalWindow));
  modalWindow.addEventListener("click", (event) => {
    if (event.target === modalWindow) {
      closeModal(modalWindow);
    }
  });
}
