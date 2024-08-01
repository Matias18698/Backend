const Asamblea = require('../models/asamblea');
const { query } = require('express');
const Alumno = require('../models/alumno');
const Votacion = require('../models/votacion');

const testBloqueo = (alumno, votacion, newAsamblea, jsonNow, fecha_inicio, fecha_fin, res) => {
    Alumno.findById(alumno).where('status', 'Regular').exec((error, cliente) => {
        if (error) {
            return res.status(400).send({ message: 'Error al buscar el alumno' });
        }
        if (!cliente) {
            return res.status(400).send({ message: 'El alumno está bloqueado' });
        }
        else {
            // Aquí puedes usar newAsamblea ya que se pasó como parámetro
            testIguales(alumno, votacion, newAsamblea, jsonNow, fecha_inicio, fecha_fin, res);
        }
    });
};



const createAsamblea = (req, res) => {
    const { fecha_inicio, fecha_fin, alumnos, votacion } = req.body;
    
    //crear asamblea
    const newAsamblea = new Asamblea({
        titulo_asamblea: req.body.titulo_asamblea,
        fecha_inicio,
        fecha_fin,
        alumnos: [req.body.alumnos],
        descripcion: req.body.descripcion,
   
    })

    const now = new Date
    const nextWeek = new Date
    nextWeek.setDate(nextWeek.getDate() + 7)
    const hourOnMilS = 3600000
    const inicio = new Date(fecha_inicio)
    const fin = new Date(fecha_fin)
    const jsonNow = now.toJSON()


    if(inicio > fin){
        return res.status(400).send({ message: 'Error, fecha de inicio es después de la fecha de fin'})
    }
    else if((fin - inicio)/hourOnMilS > 6){
        return res.status(400).send({ message: 'Error, asamblea está fuera del rango de 6 horas'}) 
    }
    else if(inicio < now || inicio > nextWeek || fin < now || fin > nextWeek){
        return res.status(400).send({ message: 'Error, fechas están fuera del periodo de una semana'})
    }
    // else if((fin-inicio)/hourOnMilS>Votacion.findByID(votacion).get('tiempoMaximoDeAsamblea')){
    //     return res.status(400).send({ message: 'Error, Supera el tiempo maximo de asamblea'})
    // }
    // else testBloqueo(alumnos, votacion, newAsamblea, jsonNow, fecha_inicio, fecha_fin, res)

    else {
        newAsamblea.save((error, asambleaGuardada) => {
            if (error) {
                console.error('Error al crear la asamblea:', error);
                return res.status(400).send({ message: 'No se pudo crear la asamblea' });
            }
        
            return res.status(200).send({ message: 'Asamblea creada exitosamente' })
        });
    }



    // Crear la votación y guardarla en la base de datos
    // const nuevaVotacion = new Votacion({
    //     // Aquí debes llenar los campos de la votación según tu modelo de datos
    //     // Por ejemplo:
    //     titulo: 'Votación para la asamblea',
    //     descripcion: 'Esta es una votación relacionada con la asamblea',
    //     opciones: ['Opción 1', 'Opción 2', 'Opción 3'],
    //     // Puedes agregar más campos según lo que necesites
    // });

    // nuevaVotacion.save((error, votacionGuardada) => {
    //     if (error) {
    //         console.error('Error al crear la votación:', error);
    //         // Manejar el error adecuadamente, puede ser lanzando una excepción, retornando un código de error, etc.
    //         return;
    //     }
    //          // Asignar el ID de la votación a la asamblea y guardar la asamblea
    //         newAsamblea.votacion = votacionGuardada._id;
    //         newAsambleaAsamblea.save((error, asambleaGuardada) => {
    //         if (error) {
    //             console.error('Error al crear la asamblea:', error);
    //             // Manejar el error adecuadamente, puede ser lanzando una excepción, retornando un código de error, etc.
    //             return;
    //         }
    //         console.log('Asamblea creada exitosamente con votación');
    //     });
    //     });


}



const getAsambleas = (req, res) => {
    Asamblea.find({}, (error, asambleas) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo realizar la busqueda" })
        }
        if (asambleas.length === 0) {
            return res.status(404).send({ message: "No se encontraron asambleas" })
        }
        return res.status(200).send(asambleas)
    }).populate('votaciones');
}

const updateAsamblea = (req, res) => {
    const { id } = req.params
    Asamblea.findByIdAndUpdate(id, req.body, (error, asamblea) => {
        if (error) {
            return res.status(400).send({ message: "No se pudo actualizar el asamblea" })
        }
        if (!asamblea) {
            return res.status(404).send({ message: "No se encontro el asamblea" })
        }
        return res.status(200).send({ message: "Asamblea modificada" })
    })
}

const deleteAsamblea = (req, res) => {
    const { id } = req.params;

    Asamblea.findByIdAndDelete(id, (error, asamblea) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido eliminar el asamblea" })
        }
        if (!asamblea) {
            return res.status(404).send({ message: "No se ha podido encontrar un asamblea" })
        }
        //revisa las votaciones que tiene la asamblea
        asamblea.votaciones.forEach(votacion => {
            //por cada votacion, busca la id y la elimina.
            Votacion.findByIdAndDelete(votacion, (error, votacion) => {
                if (error) {
                    return res.status(400).send({ message: "No se ha podido eliminar el asamblea" })
                }
            });
        });

        return res.status(200).send({ message: "Se ha eliminado el asamblea de forma correcta" })
    })
}

const getAsamblea = (req, res) => {
    const { id } = req.params
    Asamblea.findById(id, (error, asamblea) => {
        if (error) {
            return res.status(400).send({ message: "No se ha podido modificar la asamblea" })
        }
        if (!asamblea) {
            return res.status(404).send({ message: "No se ha podido encontrar una asamblea" })
        }
        return res.status(200).send(asamblea)
    }).populate('alumno');
}

const registrarAsistencia = (req, res) => {
    const { id } = req.params
    const { alumnos } = req.body;
    Asamblea.findByIdAndUpdate(id, { $push:  { alumnos: { $each: alumnos } } }, (error, asamblea) => {
            if (error) {
                return res.status(400).send({ message: "No se ha podido registrar la asistencia" })
            }
            if (!asamblea) {
                return res.status(404).send({ message: "No se ha podido encontrar una asamblea" })
            }

            return res.status(200).send({ message: "Se ha registrado la asistencia de forma correcta" })
        }
    )

}

module.exports = {
    createAsamblea,
    getAsambleas,
    updateAsamblea,
    deleteAsamblea,
    getAsamblea,
    registrarAsistencia
}