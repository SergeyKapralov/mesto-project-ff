import "./pages/index.css";
import { createCard, likeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  setModalWindowEventListeners,
} from "./components/modal.js";
import {
  clearValidation,
  enableValidation,
  validationConfig,
} from "./components/validation.js";
import {
  loadUserInfo,
  loadUserCard,
  refreshProfileData,
  refreshCardData,
  deleteCardFromServer,
  addCardLike,
  deleteCardLike,
  addNewProfileImage,
} from "./components/api.js";

import { setButtonState } from "./components/utils.js";

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
const profileImage = document.querySelector(".profile__image");
const popupProfileImage = document.querySelector(".popup_type_edit-avatar");
const formProfileElement = document.forms["new-avatar"];
const formProfileInput = formProfileElement.elements.link;
const avatar = document.querySelector(".profile__image");

formCardElement.addEventListener("submit", handleCardFormSubmit);
profileFormElement.addEventListener("submit", handleProfileFormSubmit);

// Глобальные переменные для попапа с изображением
const popupImage = document.querySelector(".popup_type_image");
const imageElement = popupImage.querySelector(".popup__image");
const captionElement = popupImage.querySelector(".popup__caption");

// Глобальная переменная для ID пользователя
let userId;

// Функция для отрисовки карточек
function renderCards(cardsData, container, handlers, userId) {
  cardsData.forEach((cardData) => {
    const cardElement = createCard(cardData, handlers, userId);
    container.append(cardElement);
  });
}

// Обработчик для иконки профиля
profileImage.addEventListener("click", () => {
  clearValidation(formProfileElement, validationConfig);
  formProfileInput.value = "";
  openModal(popupProfileImage);
});

// Обработчик для кнопки добавления карточки
pictureAddButton.addEventListener("click", () => {
  openModal(popupTypeNewCard);
});

// Обработчик для кнопки редактирования профиля
profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitleElement.textContent;
  jobInput.value = profileJobElement.textContent;
  clearValidation(profileFormElement, validationConfig);
  openModal(popupTypeEdit);
});

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  setButtonState(evt.submitter, "Сохранение...", true);

  refreshProfileData(nameInput.value, jobInput.value)
    .then((userData) => {
      profileTitleElement.textContent = userData.name;
      profileJobElement.textContent = userData.about;
      closeModal(popupTypeEdit);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(() => {
      setButtonState(evt.submitter, "Сохранить", false);
    });
}

// Обработчик отправки формы обновления аватара
formProfileElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  setButtonState(evt.submitter, "Сохранение...", true);

  addNewProfileImage(formProfileInput.value)
    .then((userData) => {
      avatar.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(popupProfileImage);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении аватара:", error);
    })
    .finally(() => {
      setButtonState(evt.submitter, "Сохранить", false);
    });
});

// Обработчик отправки формы добавления карточки
function handleCardFormSubmit(event) {
  event.preventDefault();
  setButtonState(event.submitter, "Сохранение...", true);

  refreshCardData(cardTitleInput.value, cardImageInput.value)
    .then((newCardData) => {
      const cardElement = createCard(newCardData, cardHandlers, userId);
      placesList.prepend(cardElement);
      closeModal(popupTypeNewCard);
      formCardElement.reset();
      clearValidation(formCardElement, validationConfig);
    })
    .catch((error) => {
      console.error("Ошибка при создании карточки:", error);
    })
    .finally(() => {
      setButtonState(event.submitter, "Сохранить", false);
    });
}

// Обработчики для карточек
const cardHandlers = {
  deleteCard: (cardElement, cardId) => {
    deleteCardFromServer(cardId)
      .then(() => {
        cardElement.remove();
      })
      .catch((error) => {
        console.error("Ошибка при удалении карточки:", error);
        alert("Не удалось удалить карточку. Попробуйте ещё раз.");
      });
  },
  likeCard,
  addCardLike,
  deleteCardLike,
  clickImage: (cardData) => {
    imageElement.src = cardData.link;
    imageElement.alt = `Фотография места: ${cardData.name}`;
    captionElement.textContent = cardData.name;
    openModal(popupImage);
  },
};

// Обновление информации о пользователе
function updateUserInfo(user) {
  profileTitleElement.textContent = user.name;
  profileJobElement.textContent = user.about;
  avatar.style.backgroundImage = `url('${user.avatar}')`;
}

// Загрузка данных пользователя и карточек одновременно
Promise.all([loadUserInfo(), loadUserCard()])
  .then(([userData, cardsData]) => {
    updateUserInfo(userData);
    userId = userData._id; // Сохраняем ID пользователя в глобальной переменной

    // Используем renderCards для отрисовки карточек
    renderCards(cardsData, placesList, cardHandlers, userId);

    console.log("Данные пользователя и карточки успешно загружены");
  })
  .catch((error) => {
    console.error("Ошибка:", error);
  });

// Включение валидации форм
enableValidation(validationConfig);
