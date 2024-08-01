const Votacion = require('../models/votacion');
const Asamblea = require('../models/asamblea');

const createVotacion = (req, res) =>{
    const {titulo,descripcion,opciones,status,asamblea} = req.body;

    //las opciones separadas por "," las separo y hago un array, y cuento la cantidad de opciones
    const cantopciones = opciones.split(",").length;

    //si la cantidad de opciones es 1 o menos respondo con error
    if(cantopciones<=1){
        return res.status(400).send({ message: "La votacion necesita mas de una opcion" });
    }

    //inicializo conteo
    let conteo=[];
    
    //agrego 0 para iniciar cada opcion
    for(i=0;i<cantopciones;i++){
        conteo.push(0);
    }
    //conteo=[0,0....]

    const newVotacion = new Votacion({
        titulo,
        descripcion,
        opciones,
        status,
        asamblea,
        conteo
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
    }).populate("asamblea");
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

    //busco Votacion a la que apunto
    Votacion.findById(id).exec((error, votacion) => {
        if (error) {
            return res.status(400).send({ message: "Error al buscar votacion" })
        }
        if (!votacion) {
            return res.status(404).send({ message: "Votacion no encontrada" })
        }

        let checkvoto=false;
        //busco entre los votos de la votacion si el usuario ya realizo el voto
        votacion.users?.forEach(usercheck => {
            if(usercheck==alumno){
                checkvoto=true;
            }
        });

        //si realizo el voto, envio error
        if(checkvoto){
            return res.status(400).send({ message: "votacion ya realizada" })
        }

        //separa las opciones en un array
        const opciones = votacion.opciones.split(",");
        //si votacion opciones es "si,no,blanco" el array resultante es opciones=['si','no','blanco']

        //ve el index de la opcion
        const index = opciones.indexOf(opcion);
        //si opcion es "no" el index de opciones es 1

        //obtiene los conteos actuales
        let conteo = votacion.conteo;
        //conteo=[0,1,0];

        //suma uno al index del contero
        conteo[index]++;
        //conteo[1] se suma 1 entonces conteo=[0,2,0];

        //obtengo usuarios actuales
        let users = votacion.users;
        //users=[id1,id2,id3...]

        //agrego nuevo usuario
        users.push(alumno);
        //users=[id1,id2,id3...,id_nueva]

        //Actualiza los conteos y usuarios
        Votacion.findByIdAndUpdate(id, {conteo: conteo, users: users} , (error, update) => {
            if (error) {
                return res.status(400).send({ message: "no se pudo registrar voto" })
            }
            return res.status(201).send(update);
        });
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