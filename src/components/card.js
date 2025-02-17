export function createCard(cardData, { deleteCard, likeCard, clickImage }) {
  const template = document.querySelector("template").content;
  const cardElement = template.querySelector(".places__item").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = cardData.link;
  cardImage.alt = `Фотография места: ${cardData.name}`;

  cardElement.querySelector(".card__title").textContent = cardData.name;

  // Удаление карточки
  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => deleteCard(cardElement));

  // Лайк карточки
  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", likeCard);

  // Открытие изображения
  cardImage.addEventListener("click", () => clickImage(cardData));

  return cardElement;
}

export function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function renderCards(cardsData, container, handlers) {
  cardsData.forEach((cardData) => {
    const cardElement = createCard(cardData, handlers);
    container.append(cardElement);
  });
}