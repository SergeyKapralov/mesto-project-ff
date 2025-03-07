
// Глобальная переменная для шаблона карточки
const cardTemplate = document.querySelector("template").content;

// Функция для клонирования шаблона карточки
function getCardTemplate() {
  return cardTemplate.querySelector(".places__item").cloneNode(true);
}

// Функция для создания карточки
export function createCard(cardData, handlers, userId) {
  const cardElement = getCardTemplate();

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = cardData.link;
  cardImage.alt = `Фотография места: ${cardData.name}`;

  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardElement.querySelector(".card-like-count").textContent = cardData.likes
    ? cardData.likes.length
    : 0;

  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Удаление карточки
  if (userId === cardData.owner._id) {
    deleteButton.addEventListener("click", () =>
      handlers.deleteCard(cardElement, cardData._id),
    );
  } else {
    deleteButton.style.display = "none";
  }

  // Лайк карточки
  const likeButton = cardElement.querySelector(".card__like-button");
  if (cardData.likes && cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", (evt) => {
    if (!evt.target.classList.contains("card__like-button_is-active")) {
      handlers.addCardLike(cardData._id)
        .then((updatedCard) => {
          cardElement.querySelector(".card-like-count").textContent =
            updatedCard.likes.length;

          handlers.likeCard(evt);
        })
        .catch((error) => {
          console.error("Ошибка при постановке лайка:", error);
        });
    } else {
      handlers.deleteCardLike(cardData._id)
        .then((updatedCard) => {
          cardElement.querySelector(".card-like-count").textContent =
            updatedCard.likes.length;

          handlers.likeCard(evt);
        })
        .catch((error) => {
          console.error("Ошибка при снятии лайка:", error);
        });
    }
  });

  // Открытие изображения
  cardImage.addEventListener("click", () => handlers.clickImage(cardData));

  return cardElement;
}

// Функция для обработки лайка
export function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}