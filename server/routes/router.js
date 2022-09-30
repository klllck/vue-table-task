const Router = require('express');
const router = new Router();
const mainController = require('../controllers/main.controller')

router.get('/main', mainController.getData)

module.exports = router;