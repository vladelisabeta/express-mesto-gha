const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

// delete card
router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys()({
      cardId: Joi.string(),
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
      link: Joi.string().required(),
    }),
  }),

  createCard,
);
// likes :)
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys()({
      cardId: Joi.string(),
    }),
  }),
  likeCard,
);
// no likes? :(
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys()({
      cardId: Joi.string(),
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
