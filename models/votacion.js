const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const asamblea = require('./asamblea');
const voto = require('./voto');

const VotacionSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    opciones: { type: String, required: true },
    status:{
        type: String,
        required: true,
        enum: [
            'Activa',
            'Inactiva'
        ]
    },
    asamblea:{
        type: Schema.Types.ObjectId,
        ref: asamblea,
        required: true
    },
    votos:[{
        type: Schema.Types.ObjectId,
        ref: voto
    }]
});



module.exports =  mongoose.model('votacion',VotacionSchema);
