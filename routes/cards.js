const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../utils/consts');

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

// delete card
router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCardById,
);

// create Card
router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }),
    }),
  }),

  createCard,
);
// likes :)
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeCard,
);
// no likes? :(
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;

// router.get('/cards', getCards);
// router.delete('/cards/:cardId', deleteCardById);
// router.post('/cards', createCard);
// router.put('/cards/:cardId/likes', likeCard);
// router.delete('/cards/:cardId/likes', dislikeCard);
