const express = require('express');
const api = express.Router();
const userController = require('../controllers/userController.js');

api.post('/user', userController.createUser);
api.get('/users', userController.getUsers);
api.post('/sessionStart', userController.sessionStart);

module.exports = api;