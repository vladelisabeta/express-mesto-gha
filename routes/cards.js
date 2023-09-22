const router = require('express').Router();
const Card = require('../models/user');

const { getCards, deleteCardById, createCard } = require('../controllers/cards');

router.get('/cards', getCards)
router.delete('/cards/:cardId', deleteCardById)
router.post('/cards', createCard)

module.exports = router;