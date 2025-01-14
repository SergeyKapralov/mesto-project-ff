// @todo: Темплейт карточки
const container = document.querySelector(".places__list");
const addButton = document.querySelector(".profile__add-button");

function cardCreate(dataCard, deleteCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardClone = cardTemplate.cloneNode(true);
  cardClone.querySelector(".card__image").src = dataCard.link;
  cardClone.querySelector(".card__image").alt = dataCard.alt;
  cardClone.querySelector(".card__title").textContent = dataCard.name;
  const deleteIcon = cardClone.querySelector(".card__delete-button");

  deleteIcon.addEventListener("click", () =>
    deleteCallback(deleteIcon.closest(".card")),
  );

  return cardClone;
}

function deleteCallback(card) {
  if (!card) {
    return;
  }

  card.remove();
}

function addCards() {
  initialCards.forEach((dataCard) => {
    const card = cardCreate(dataCard, deleteCallback);
    container.append(card);
  });
}

addButton.addEventListener("click", addCards);
addCards();

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу
