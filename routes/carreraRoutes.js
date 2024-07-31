const express = require('express');
const api = express.Router();
const carreraController = require('../controllers/carreraController.js');

api.post('/carrera', carreraController.createCarrera);
api.get('/carreras', carreraController.getCarreras);
api.get('/carrera/search/:id', carreraController.getCarrera);
api.put('/carrera/update/:id', carreraController.updateCarrera);
api.delete('/carrera/delete/:id', carreraController.deleteCarrera);

module.exports = api;