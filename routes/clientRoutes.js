const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const  { authMiddleware } = require('../middleware/auth');

router.get('/', clientController.getClients);
router.get('/:client_id',authMiddleware, clientController.getClient);
router.post('/add',authMiddleware, clientController.createClient);
router.put('/update/:client_id',authMiddleware, clientController.updateClient);

module.exports = router;