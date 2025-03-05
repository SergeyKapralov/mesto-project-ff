export function createCard(
  cardData,
  { deleteCard, likeCard, clickImage, addCardLike, deleteCardLike },
  userId,
) {
  const template = document.querySelector("template").content;
  const cardElement = template.querySelector(".places__item").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = cardData.link;
  cardImage.alt = `Фотография места: ${cardData.name}`;

  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardElement.querySelector(".card-like-count").textContent = cardData.likes
    ? cardData.likes.length
    : 0;
  const deleteButton = cardElement.querySelector(".card__delete-button");
  console.log(cardData.owner._id);
  // Удаление карточки
  if (userId === cardData.owner._id) {
    deleteButton.addEventListener("click", () =>
      deleteCard(cardElement, cardData._id),
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
      addCardLike(cardData._id)
        .then((updatedCard) => {
          // Обновляем количество лайков
          const likeCountElement =
            cardElement.querySelector(".card-like-count");
          likeCountElement.textContent = updatedCard.likes.length;

          // Визуальное переключение кнопки
          likeCard(evt);
        })
        .catch((error) => {
          console.error("Ошибка при постановке лайка:", error);
        });
    } else {
      deleteCardLike(cardData._id)
        .then((updatedCard) => {
          // Обновляем количество лайков
          const likeCountElement =
            cardElement.querySelector(".card-like-count");
          likeCountElement.textContent = updatedCard.likes.length;

          // Визуальное переключение кнопки
          likeCard(evt);
        })
        .catch((error) => {
          console.error("Ошибка при снятии лайка:", error);
        });
    }
  });

  // Открытие изображения
  cardImage.addEventListener("click", () => clickImage(cardData));

  return cardElement;
}

export function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export function renderCards(cardsData, container, handlers, userId) {
  cardsData.forEach((cardData) => {
    const cardElement = createCard(cardData, handlers, userId);
    container.append(cardElement);
  });
}
