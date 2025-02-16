export function createCard(massive, callback, likeCard, openImage) {
  const template = document.querySelector("template").content;
  const cloneTemplate = template.querySelector(".places__item").cloneNode(true);
  cloneTemplate.querySelector(".card__image").src = massive.link;
  cloneTemplate.querySelector(".card__title").textContent = massive.name;
  const deleteButton = cloneTemplate.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => callback(cloneTemplate));
  cloneTemplate.addEventListener("click", likeCard);
  cloneTemplate.addEventListener("click", openImage);
  return cloneTemplate;
}

// Функция обработки лайка
export function likeCard(evt) {
  const likeButton = evt.target.closest(".card__like-button");
  if (likeButton) {
    likeButton.classList.toggle("card__like-button_is-active");
  }
}

// Функция удаления карточки
export function callback(deleteCard) {
  if (!deleteCard) {
    return;
  }
  deleteCard.remove();
}

// Функция отрисовки карточек
export function card(initialCards, place, callback, likeCard, openImage) {
  initialCards.forEach((i) => {
    const add = createCard(i, callback, likeCard, openImage);
    place.append(add);
  });
}
