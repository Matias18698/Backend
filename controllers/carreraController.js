//Generar un controlador para la entidad carrera
const Carrera = require('../models/carrera');



const getCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.find();
        res.status(200).send(carreras);
    } catch (error) {
        res.status(400).send({ message: "No se pudo realizar la busqueda" });
    }
}

const createCarrera = async (req, res) => {
    const carrera = new Carrera(req.body);
    try {
        await carrera.save();
        res.status(201).send({ message: "Carrera creada" });
    } catch (error) {
        res.status(400).send({ message: "No se pudo crear la carrera" });
    }
}

const updateCarrera = async (req, res) => {
    const { id } = req.params;
    try {
        await Carrera.findByIdAndUpdate(id, req.body);
        res.status(200).send({ message: "Carrera modificada" });
    }
    catch (error) {
        res.status(400).send({ message: "No se pudo modificar la carrera" });
    }
}

const deleteCarrera = async (req, res) => {
    const { id } = req.params;
    try {
        await Carrera.findByIdAndDelete(id);
        res.status(200).send({ message: "Carrera eliminada" });
    } catch (error) {
        res.status(400).send({ message: "No se pudo eliminar la carrera" });
    }
}
const getCarrera = async (req, res) => {
    const { id } = req.params;
    try {
        const carrera = await Carrera.findById(id);
        res.status(200).send(carrera);
    } catch (error) {
        res.status(400).send({ message: "No se pudo encontrar la carrera" });
    }
}

module.exports = {
    getCarreras,
    createCarrera,
    updateCarrera,
    deleteCarrera,
    getCarrera
}
