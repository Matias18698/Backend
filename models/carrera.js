const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CarreraSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  abreviacion: {
    type: String,
    required: true
  }
});
module.exports =  mongoose.model('carrera',CarreraSchema);