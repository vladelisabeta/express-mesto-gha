const router = require('express').Router();

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', deleteCardById);
router.post('/cards', createCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
