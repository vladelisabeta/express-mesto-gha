const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((r) => res.status(HTTP_STATUS_CREATED).send(r))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' });
    });
};

module.exports.getCards = (req, res) => Card.find({})
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' }));

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((r) => {
      if (r === null) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена!' });
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Такой карточки не существует!' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((r) => {
    if (r === null) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена!' });
    }
    return res.status(HTTP_STATUS_OK).send(r);
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' });
  });

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((r) => {
      if (r === null) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена!' });
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Непредвиденная ошибка на сервере.' });
    });
};
