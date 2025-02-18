import "./pages/index.css";
import { initialCards } from "./cards.js";
import {
  createCard,
  likeCard,
  deleteCard,
  renderCards,
} from "./components/card.js";
import {
  openModal,
  closeModal,
  setModalWindowEventListeners,
} from "./components/modal.js";

// Глобальные константы
const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  popup.classList.add("popup_is-animated");
  setModalWindowEventListeners(popup);
});

const placesList = document.querySelector(".places__list");
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
const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");

// Отрисовка начальных карточек
const cardHandlers = {
  deleteCard,
  likeCard,
  clickImage: (cardData) => {
    const popupImage = document.querySelector(".popup_type_image");
    const imageElement = popupImage.querySelector(".popup__image");
    const captionElement = popupImage.querySelector(".popup__caption");

    imageElement.src = cardData.link;
    imageElement.alt = `Фотография места: ${cardData.name}`;
    captionElement.textContent = cardData.name;
    openModal(popupImage);
  },
};

renderCards(initialCards, placesList, cardHandlers);

// Обработчик для кнопки добавления карточки
pictureAddButton.addEventListener("click", () => {
  openModal(popupTypeNewCard);
});

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitleElement.textContent;
  jobInput.value = profileJobElement.textContent;
  openModal(popupTypeEdit);
});

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitleElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal(popupTypeEdit);
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

// Обработчик отправки формы добавления карточки
function handleCardFormSubmit(event) {
  event.preventDefault();

  const newCard = {
    name: cardTitleInput.value,
    link: cardImageInput.value,
  };

  const cardElement = createCard(newCard, cardHandlers);
  placesList.prepend(cardElement);
  closeModal(popupTypeNewCard);
  formCardElement.reset();
}

formCardElement.addEventListener("submit", handleCardFormSubmit);
