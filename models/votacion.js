const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const asamblea = require('./asamblea');
const user = require('./user');

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

    conteo:[{
        type: Number,
        required: false,
    }],

    users:[{
        type: Schema.Types.ObjectId,
        required: false,
        ref: user
    }],
});



module.exports =  mongoose.model('votacion',VotacionSchema);
