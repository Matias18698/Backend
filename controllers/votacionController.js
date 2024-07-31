const Votacion = require('../models/votacion');
const Asamblea = require('../models/asamblea');
const Voto = require('../models/voto');

const createVotacion = (req, res) =>{
    const {titulo,descripcion,opciones,status,asamblea} = req.body;
    const newVotacion = new Votacion({
        titulo,
        descripcion,
        opciones,
        status,
        asamblea
    });

    newVotacion.save((error, votacion) => {
        if (error) {
            console.error(error); // Agrega este console.log para ver el error en la consola
            return res
            .status(400)
            .send({ message: "No se ha podido crear el votacion" });
        }
        console.log(votacion); // Agrega este console.log para verificar el Votacion guardado

        //Si se crea una votacion, se agrega a la asamblea segun su ID
        Asamblea.findByIdAndUpdate(asamblea, { $push:  { votaciones: { $each: [votacion] } } }, (error, update) => {
            console.log(update)
        })

        return res.status(201).send(votacion);
    });
}

const getVotacion = (req, res) => {
    const { id } = req.params;
    Votacion.findById(id).exec((error, votacion) => {
        if (error) {
            return res.status(400).send({ message: "Error al buscar votacion" })
        }
        if (!votacion) {
            return res.status(404).send({ message: "Votacion no encontrada" })
        }
        return res.status(200).send(votacion)
    })
}

const updateVotacion = (req, res) => {
    const { id } = req.params;
    Votacion.findByIdAndUpdate(id, req.body, (error, votacion) => {
        if (error) {
            return res.status(400).send({ message: "Error al buscar votacion" })
        }
        if (!votacion) {
            return res.status(404).send({ message: "Votacion no encontrada" })
        }
        return res.status(200).send(votacion)
    })
}

const getVotaciones = (req, res) =>{
    Votacion.find({},(error, votaciones)=>{
        if(error){
            return res.status(400).send({ message:'Error al obtener el votacion'})
        }if (votaciones.length === 0) {
            return res.status(404).send({ message: "Sin votaciones registradas" })
        }
        return res.status(200).send(votaciones)
    }).populate("asamblea").populate("votos")
}

const deleteVotacion= (req, res) => {
    const { id } = req.params;
    Votacion.findByIdAndDelete(id, (error, votacion) => {
        if (error) {
            return res.status(400).send({ message: "Error al obtener el votacion" })
        }
        if (!votacion) {
            return res.status(404).send({ message: "Votacion no encontrado" })
        }
        return res.status(200).send(votacion)
    })
}

const votar= (req, res) => {
    const { id } = req.params;
    const {opcion,alumno} = req.body;
    const newVoto = new Voto({
        opcion,
        alumno,
    });
    //busco Votacion a la que apunto
    Votacion.findById(id).populate("votos").exec((error, votacion) => {
        if (error) {
            return res.status(400).send({ message: "Error al buscar votacion" })
        }
        if (!votacion) {
            return res.status(404).send({ message: "Votacion no encontrada" })
        }
        let checkvoto=false;
        //busco entre los votos de la votacion si el alumno ya realizo el voto
        votacion.votos.forEach(voto => {
            if(voto.alumno==alumno){
                console.log(voto);
                checkvoto=true;
            }
        });
        //si realizo el voto, envio error
        if(checkvoto){
            return res.status(400).send({ message: "votacion ya realizada" })
        }else{
            //si no encuentro error, guardo el voto
            newVoto.save((error, voto) => {
                if (error) {
                    console.error(error); // Agrega este console.log para ver el error en la consola
                    return res
                    .status(400)
                    .send({ message: "No se ha podido crear el voto" });
                }
                //cuando el voto este guardado, se agrega la id a la votacion
                Votacion.findByIdAndUpdate(id, { $push:  { votos: { $each: [voto] } } }, (error, update) => {
                    if (error) {
                        return res.status(400).send({ message: "no se pudo registrar voto" })
                    }
                });
                return res.status(201).send(voto);
            });
        }
    });
}


const changeStatus = (req, res) => {
    const { id } = req.params
    const query = Votacion.findById(id)
    query.exec((error, Votacion) => {
        if(error){
            return res.status(400).send({ message: "No se pudo actualizar la votacion" })
        }
        if(Votacion.status === 'Cerrada'){
            Votacion.updateOne({status: 'Disponible'}).exec((error) => {
                if(error){
                    return res.status(400).send({ message: "No se pudo actualizar la votacion" })
                }
                return res.status(200).send({ message: "Status actualizado votacion abierta" })
            })
        }
        else{
            Votacion.updateOne({status: 'cerrada'}).exec((error) => {
                if(error){
                    return res.status(400).send({ message: "No se pudo actualizar la votacion" })
                }
                return res.status(200).send({ message: "Status actualizado a votacion cerrada" })
            })

        }
    })
}

module.exports = {
    createVotacion,
    getVotacion,
    updateVotacion,
    deleteVotacion,
    changeStatus,
    getVotaciones,
    votar,
}