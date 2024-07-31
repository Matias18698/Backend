const Alumno = require('../models/alumno.js')

const checkRUT = (req, res, next) => {
    Alumno.findOne({ _id: req.body.rut}, (err, alumno) => {
        if(err){
            return res.status(400).send({message:"El usuario no existe"})
        }
        if(!alumno){
            return res.status(404).send({message: "Usuario no existe"})
        }
        return res.status(200).send({message:"Usuario logeado correctamente"})
    })
}

module.exports = checkRUT;
