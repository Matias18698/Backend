const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alumno = require('./alumno');

const VotoSchema = new Schema({
  opcion: {
    type: String,
    required: true
  },
  alumno:{
      type: Schema.Types.ObjectId,
      ref: alumno,
      required: true
  },
});
module.exports =  mongoose.model('voto',VotoSchema);