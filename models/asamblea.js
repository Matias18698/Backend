const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AsambleaSchema = new Schema({
    fecha_inicio:{
        type: Date,
        required: false
    },
    fecha_fin:{
        type: Date,
        required: false
    }, 
    titulo_asamblea:{
        type: String,
        required: true,
        
    },
    /*
    alumnos:[{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'alumno'
    }],
    */

    votaciones:[{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'votacion'
    }],
    
    descripcion:{
        type: String,
        required: true,
       
    },
});


module.exports = mongoose.model('asamblea', AsambleaSchema);
