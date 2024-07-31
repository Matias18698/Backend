const { query } = require("express");
const User = require("../models/user.js");
const Alumno = require("../models/alumno.js");
const Regex = require("../utils/testRegex");

const createUser = async (req, res) => {
  const { rut, nombre, apellido, correo, password, rol, esAlumno, status } =
    req.body;

  const newUser = new User({
    rut,
    nombre,
    apellido,
    correo,
    password,
    rol,
    esAlumno,
    status,
  });
  if (!Regex.rutRegex(rut)) {
    return res.status(400).send({ message: "Mal formato de rut" });
  } else if (!Regex.nombreRegex(nombre)) {
    return res.status(400).send({ message: "Mal formato de nombre" });
  } else if (!Regex.nombreRegex(apellido)) {
    return res.status(400).send({ message: "Mal formato de apellido" });
  } else if (!Regex.correoRegex(correo)) {
    return res.status(400).send({ message: "Mal formato de correo" });

  }
    // Buscar en el esquema de Alumno si existe un documento con el RUT dado
    const result = await Alumno.findOne({ rut: rut }).exec();

    //retornar carrera desde Alumno
    if (result) {
      newUser.carrera = result.carrera;
      newUser.nombre = result.nombre;
      newUser.apellido = result.apellido;
      newUser.correo = result.correo;
    }

    // Retornar true si el RUT está presente, de lo contrario false
    newUser.esAlumno = result ? true : false;
    newUser.save((error, user) => {
      if (error) {
        console.error(error); // Agrega este console.log para ver el error en la consola
        return res
          .status(400)
          .send({ message: "No se ha podido crear el usuario" });
      }
      console.log(user); // Agrega este console.log para verificar el usuario guardado
      return res.status(201).send(user);
    });
  };

const getUsers = (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      return res.status(400).send({ message: "No se pudo listar usuarios" });
    }
    if (users.length === 0) {
      return res.status(404).send({ message: "No se encontraron usuarios" });
    }
    return res.status(200).send(users);
  }).populate("carrera");
};

const updateUser = (req, res) => {
  const { id } = req.params;
  User.findByIdAndUpdate(id, req.body, (error, user) => {
    if (error) {
      return res
        .status(400)
        .send({ message: "No se pudo actualizar el usuario" });
    }
    if (!user) {
      return res.status(404).send({ message: "No se encontro el usuario" });
    }
    return res.status(200).send({ message: "Usuario modificado" });
  });
};

const sessionStart = async (req, res) => {
  const { rut,password } = req.body;
  console.log(req.body)
  await User.findOne({rut:rut,password:password}, (error, user) => {
    if (error) {
      return res.status(400).send({ message: "No se pudo listar usuarios" });
    }
    if (!user) {
      return res.status(404).send({ message: "Rut o Contraseña no coinciden" });
    }
    return res.status(200).send(user);
  });
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  sessionStart,
};
