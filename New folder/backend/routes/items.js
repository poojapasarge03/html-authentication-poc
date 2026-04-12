const router = require('express').Router();
const { getStats, getItems, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const protect = require('../middleware/auth');

router.use(protect);
router.get('/stats', getStats);
router.get('/', getItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
