const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carrera = require('./carrera');
const UserSchema = new Schema({
    rut:{
        type: String,
        required: true,
        minLength: 1,
        maxLength: 12
    },
    nombre:{
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    apellido:{
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    correo:{
        type: String,
        required: true,
        minLength: 1,
        maxLength: 250
    },
    password:{
        type: String,
        required: true,
        minLength: 1,
        maxLength: 250
    },
    rol:{
        type: String,
        required: true,
        enum: [
            'Admin',
            'Alumno',
            'Miembro CEE'
        ]
    },
    esAlumno:{
        type: Boolean,
        required: true
    },
    carrera:{
        type: Schema.Types.ObjectId,
        ref: carrera,
        required: false
    },
    
    status:{
        type: String,
        required: true,
        enum: [
            'Regular',
            'No regular'
        ]
    }
});

module.exports =  mongoose.model('user',UserSchema);