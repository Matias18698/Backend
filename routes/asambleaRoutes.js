const express = require('express');
const api = express.Router();
const asambleaController = require('../controllers/asambleaController.js');
const generarReporteController = require('../controllers/generarReporteController.js');

api.post('/asamblea', asambleaController.createAsamblea);
api.get('/asambleas', asambleaController.getAsambleas);
api.put('/asamblea/update/:id', asambleaController.updateAsamblea);
//api.put('/asamblea/status/:id', asambleaController.updateStatus);
api.delete('/asamblea/delete/:id', asambleaController.deleteAsamblea);
api.get('/asamblea/generarReporte/:id', generarReporteController.createTable);
api.post('/asamblea/registrarAsistencia/:id', asambleaController.registrarAsistencia);
module.exports = api;