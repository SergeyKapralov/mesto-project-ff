import "./pages/index.css";
import { initialCards } from "./cards.js";
// import { includes } from "core-js/core/array";
import { createCard, likeCard, callback, card } from "./components/card.js";
import { openModal, closeModal } from "./components/modal.js";

// Глобальные константы
const smoothlyAnimation = document.querySelectorAll(".popup");
smoothlyAnimation.forEach((popup) => popup.classList.add("popup_is-animated"));

const place = document.querySelector(".places__list");
const addButton = document.querySelector(".profile__add-button");
const profileEditButton = document.querySelector(".profile__edit-button");
const pictureAddButton = document.querySelector(".profile__add-button");
const profileFormElement = document.forms["edit-profile"];
const nameInput = profileFormElement.elements.name;
const jobInput = profileFormElement.elements.description;
const profileTitleElement = document.querySelector(".profile__title");
const profileJobElement = document.querySelector(".profile__description");
const formCardElement = document.forms["new-place"];
const cardTitleInput = formCardElement.elements["place-name"];
const cardImageInput = formCardElement.elements.link;

// Отрисовка начальных карточек
card(initialCards, place, callback, likeCard, openImage);

// Обработчик для кнопки добавления карточки
addButton.addEventListener("click", () => {
  card(initialCards, place, callback, likeCard, openImage);
});

// Установка плейсхолдеров
nameInput.placeholder = profileTitleElement.textContent;
jobInput.placeholder = profileJobElement.textContent;

// Обработчики событий для модальных окон
document.addEventListener("click", (event) => {
  if (event.target === profileEditButton) {
    openModal(document.querySelector(".popup_type_edit"));
  } else if (event.target === pictureAddButton) {
    openModal(document.querySelector(".popup_type_new-card"));
  } else if (event.target.classList.contains("popup")) {
    closeModal(event.target);
  } else if (event.target.classList.contains("popup__close")) {
    const popup = event.target.closest(".popup");
    closeModal(popup);
  }
});

// Обработчик закрытия модального окна по Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openPopup = document.querySelector(".popup_is-opened");
    closeModal(openPopup);
  }
});

// Обработчик отправки формы редактирования профиля
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitleElement.textContent = nameInput.value || nameInput.placeholder;
  profileJobElement.textContent = jobInput.value || jobInput.placeholder;
  closeModal(document.querySelector(".popup_type_edit"));
}

profileFormElement.addEventListener("submit", handleFormSubmit);

// Обработчик отправки формы добавления карточки
function autorCard(event) {
  event.preventDefault();

  const titleValue = cardTitleInput.value;
  const imagesValue = cardImageInput.value;

  const craftCard = {
    name: titleValue,
    link: imagesValue,
  };

  const add = createCard(craftCard, callback, likeCard, openImage);
  place.prepend(add);
  closeModal(document.querySelector(".popup_type_new-card"));
  formCardElement.reset();
}

formCardElement.addEventListener("submit", autorCard);

// Функция открытия изображения
export function openImage(evt) {
  const image = evt.target.closest(".card__image");
  if (image) {
    const PopupImages = document.querySelector(".popup_type_image");
    const ImageSource = PopupImages.querySelector(".popup__image");
    const PopupImagesTitle = PopupImages.querySelector(".popup__caption");
    const card = image.closest(".card");
    ImageSource.src = image.src;
    PopupImagesTitle.textContent =
      card.querySelector(".card__title").textContent;
    PopupImages.classList.toggle("popup_is-opened");
  }
}
