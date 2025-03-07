const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-33",
  headers: {
    authorization: "de1a89d2-bd12-4814-9e19-b59dd9dc8e54",
    "Content-Type": "application/json",
  },
};

function checkResponse(response) {
  if (!response.ok) {
    return Promise.reject(`Ошибка: ${response.status}`);
  }
  return response.json();
}

// Загрузка информации о пользователе 
export function loadUserInfo() { 
  return fetch(`${config.baseUrl}/users/me`, { 
    method: "GET", 
    headers: config.headers, 
  }).then(checkResponse);
} 

// Загрузка карточек 
export function loadUserCard() { 
  return fetch(`${config.baseUrl}/cards`, { 
    method: "GET", 
    headers: config.headers, 
  }).then(checkResponse);
} 

// Обновление данных профиля 
export function refreshProfileData(profileName, profileDescription) { 
  return fetch(`${config.baseUrl}/users/me`, { 
    method: "PATCH", 
    headers: config.headers, 
    body: JSON.stringify({ 
      name: profileName, 
      about: profileDescription, 
    }), 
  }).then(checkResponse);
} 

// Добавление новой карточки 
export function refreshCardData(cardName, cardImage) { 
  return fetch(`${config.baseUrl}/cards`, { 
    method: "POST", 
    headers: config.headers, 
    body: JSON.stringify({ 
      name: cardName, 
      link: cardImage, 
    }), 
  }).then(checkResponse);
} 

// Удаление карточки 
export function deleteCardFromServer(cardId) { 
  return fetch(`${config.baseUrl}/cards/${cardId}`, { 
    method: "DELETE", 
    headers: config.headers, 
  }).then(checkResponse);
} 

// Постановка лайка 
export function addCardLike(cardId) { 
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, { 
    method: "PUT", 
    headers: config.headers, 
  }).then(checkResponse);
} 

// Снятие лайка 
export function deleteCardLike(cardId) { 
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, { 
    method: "DELETE", 
    headers: config.headers, 
  }).then(checkResponse);
} 

// Обновление аватара 
export function addNewProfileImage(profileImage) { 
  return fetch(`${config.baseUrl}/users/me/avatar`, { 
    method: "PATCH", 
    headers: config.headers, 
    body: JSON.stringify({ 
      avatar: profileImage, 
    }), 
  }).then(checkResponse);
}