const express = require('express');

const usersController = require('../controllers/users');

const router = express.Router();

router.post('/', usersController.create);
router.get('/', usersController.getAll);

module.exports = router;
