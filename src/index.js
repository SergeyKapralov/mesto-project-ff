import "./pages/index.css";
import { createCard, likeCard, renderCards } from "./components/card.js";
import {
  openModal,
  closeModal,
  setModalWindowEventListeners,
} from "./components/modal.js";
import {
  clearValidation,
  enableValidation,
  validationConfig,
} from "./validation.js";
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

// Отрисовка начальных карточек
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
    const popupImage = document.querySelector(".popup_type_image");
    const imageElement = popupImage.querySelector(".popup__image");
    const captionElement = popupImage.querySelector(".popup__caption");

    imageElement.src = cardData.link;
    imageElement.alt = `Фотография места: ${cardData.name}`;
    captionElement.textContent = cardData.name;
    openModal(popupImage);
  },
};

//Обработчик для иконки профиля
profileImage.addEventListener("click", () => {
  clearValidation(formProfileElement, validationConfig);
  formProfileInput.value = "";
  openModal(popupProfileImage);
});

// Обработчик для кнопки добавления карточки
pictureAddButton.addEventListener("click", () => {
  clearValidation(formCardElement, validationConfig);
  cardTitleInput.value = "";
  cardImageInput.value = "";
  openModal(popupTypeNewCard);
});

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitleElement.textContent;
  jobInput.value = profileJobElement.textContent;
  clearValidation(profileFormElement, validationConfig);
  openModal(popupTypeEdit);
});

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  setButtonState(evt.target, "Сохранение", true);
  profileTitleElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  refreshProfileData(
    profileTitleElement.textContent,
    profileJobElement.textContent,
  ).then(() => {
    setButtonState(evt.target, "Сохранить", false);
  });
  closeModal(popupTypeEdit);
}

//функция обновления аватарки
formProfileElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  setButtonState(evt.target, "Сохранение...", true);
  addNewProfileImage(formProfileInput.value).then((data) => {
    avatar.style.backgroundImage = `url('${data.avatar}')`;
    setButtonState(evt.target, "Сохранить", false);
    closeModal(popupProfileImage);
  });
});

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

// Обработчик отправки формы добавления карточки !!!!!
function handleCardFormSubmit(event, userId) {
  event.preventDefault();
  setButtonState(event.target, "Сохранение...", true);

  refreshCardData(cardTitleInput.value, cardImageInput.value)
    .then((newCardData) => {
      const cardElement = createCard(newCardData, cardHandlers, userId);
      placesList.prepend(cardElement);
      setButtonState(event.target, "Сохранить", false);
      // Закрываем модальное окно и сбрасываем форму
      closeModal(popupTypeNewCard);
      formCardElement.reset();
    })
    .catch((error) => {
      console.error("Ошибка при создании карточки:", error);
    });
}

enableValidation(validationConfig);

//начало работы с API или спринт 7.2

// Обновление информации о пользователе
function updateUserInfo(user) {
  document.querySelector(".profile__title").textContent = user.name;
  document.querySelector(".profile__description").textContent = user.about;
  avatar.style.backgroundImage = `url('${user.avatar}')`;
}

// Загрузка данных пользователя и карточек одновременно
Promise.all([loadUserInfo(), loadUserCard()])
  .then(([userData, cardsData]) => {
    updateUserInfo(userData);
    let userId = userData._id;

    renderCards(cardsData, placesList, cardHandlers, userId);

    formCardElement.addEventListener("submit", (event) =>
      handleCardFormSubmit(event, userId),
    );

    console.log("Данные пользователя и карточки успешно загружены");
  })
  .catch((error) => {
    console.error("Ошибка:", error);
  });

//Функция изменения текста кнопки submit

function setButtonState(button, text, isDisabled) {
  button.querySelector(".button").textContent = text;
  button.disabled = isDisabled;
}
