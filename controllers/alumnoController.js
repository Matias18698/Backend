const { query } = require("express");
const Alumno = require("../models/alumno.js");
const Regex = require("../utils/testRegex");
const express = require("express");
const router = express.Router();

const createAlumno = async (req, res) => {
  const { rut, nombre, apellido, numero, correo, carrera, status } = req.body;
  const newAlumno = new Alumno({
    rut,
    nombre,
    apellido,
    numero,
    correo,
    carrera,
    status,
  });
  const cleanRut = rut.replace(/[^\dkK]/g, "");
  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += body.charAt(i) * multiplier;
    multiplier = multiplier < 7 ? multiplier + 1 : 2;
  }

  const mod = 11 - (sum % 11);
  const computedVerifier = mod === 11 ? "0" : mod === 10 ? "K" : mod.toString();

  if (computedVerifier != verifier) {
    return res.status(400).send({ message: "Rut invalido" });
  }
  if (!Regex.rutRegex(rut)) {
    return res.status(400).send({ message: "Mal formato de rut" });
  } else if (!Regex.nombreRegex(nombre)) {
    return res.status(400).send({ message: "Mal formato de nombre" });
  } else if (!Regex.nombreRegex(apellido)) {
    return res.status(400).send({ message: "Mal formato de apellido" });
  } else if (!Regex.numeroRegex(numero)) {
    return res.status(400).send({ message: "Mal formato de numero" });
  } else if (!Regex.correoRegex(correo)) {
    return res.status(400).send({ message: "Mal formato de correo" });
  }
  // else if(!Regex.carreraRegex(carrera)){
  //     return res.status(400).send({ message: "Mal formato de carrera" })
  // }
  else {
    newAlumno.save((error, alumno) => {
      if (error) {
        console.error(error); // Agrega este console.log para ver el error en la consola
        return res
          .status(400)
          .send({ message: "No se ha podido crear el alumno" });
      }

      console.log(alumno); // Agrega este console.log para verificar el alumno guardado
      return res.status(201).send(alumno);
    });
  }
};

const getAlumnos = (req, res) => {
  Alumno.find({}, (error, alumnos) => {
    if (error) {
      return res
        .status(400)
        .send({ message: "No se pudo realizar la busqueda" });
    }
    if (alumnos.length === 0) {
      return res.status(404).send({ message: "No se encontraron alumnos" });
    }
    return res.status(200).send(alumnos);
  }).populate("carrera");
};

module.exports = router;

const changeStatus = (req, res) => {
  const { id } = req.params;
  const query = Alumno.findById(id);
  query.exec((error, alumno) => {
    if (error) {
      return res
        .status(400)
        .send({ message: "No se pudo actualizar el alumno 1" });
    }
    if (alumno.status === "Bloqueado") {
      alumno.updateOne({ status: "Permitido" }).exec((error) => {
        if (error) {
          return res
            .status(400)
            .send({ message: "No se pudo actualizar el alumno 2" });
        }
        return res
          .status(200)
          .send({ message: "Status actualizado a Permitido" });
      });
    } else {
      alumno.updateOne({ status: "Bloqueado" }).exec((error) => {
        if (error) {
          return res
            .status(400)
            .send({ message: "No se pudo actualizar el alumno :" + error });
        }
        return res
          .status(200)
          .send({ message: "Status actualizado a Bloqueado" });
      });
    }
  });
};

const updateAlumno = (req, res) => {
  const { id } = req.params;
  Alumno.findByIdAndUpdate(id, req.body, (error, alumno) => {
    if (error) {
      return res
        .status(400)
        .send({ message: "No se pudo actualizar el alumno" });
    }
    if (!alumno) {
      return res.status(404).send({ message: "No se encontro el alumno" });
    }
    return res.status(200).send({ message: "Alumno modificado" });
  });
};

const deleteAlumno = (req, res) => {
  const { id } = req.params;
  Alumno.findByIdAndDelete(id, (error, alumno) => {
    if (error) {
      return res
        .status(400)
        .send({ message: "No se ha podido eliminar el alumno" });
    }
    if (!alumno) {
      return res
        .status(404)
        .send({ message: "No se ha podido encontrar un alumno" });
    }
    return res
      .status(200)
      .send({ message: "Se ha eliminado el alumno de forma correcta" });
  });
};

const getAlumno = (req, res) => {
  const { id } = req.params;
  Alumno.findById(id, (error, alumno) => {
    if (error) {
      return res
        .status(400)
        .send({ message: "No se ha podido modificar el alumno" });
    }
    if (!alumno) {
      return res
        .status(404)
        .send({ message: "No se ha podido encontrar un alumno" });
    }
    return res.status(200).send(alumno);
  });
};

module.exports = {
  createAlumno,
  getAlumnos,
  changeStatus,
  updateAlumno,
  deleteAlumno,
  getAlumno,
};
