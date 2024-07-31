const express = require('express');
const router = express.Router(); // Aquí defines el objeto router
const alumnoController = require('../controllers/alumnoController.js');
const checkRUT = require('../middleware/checkRUT.js');
const path = require('path'); // Asegúrate de importar el módulo 'path' para manejar rutas de archivos

router.post('/alumno', alumnoController.createAlumno);
router.get('/alumnos', alumnoController.getAlumnos);
router.put('/alumno/status/:id', alumnoController.changeStatus);
router.get('/alumno/search/:id', alumnoController.getAlumno);
router.put('/alumno/update/:id', alumnoController.updateAlumno);
router.delete('/alumno/delete/:id', alumnoController.deleteAlumno);
router.post('/login', checkRUT);



// Ruta para mostrar el formulario de creación de alumno
router.get('/createAlumno', (req, res) => {
    res.render('createAlumno'); // Renderiza la vista 'createAlumno.ejs' ubicada en el directorio de vistas (por defecto, en la carpeta 'views')
});

// Ruta para mostrar el formulario de edición de alumno
router.get('/editAlumno/:id', (req, res) => {
    const alumnoId = req.params.id;
    // Aquí podrías buscar el alumno por su ID en la base de datos y luego renderizar el formulario de edición
    res.render('editAlumno', { alumnoId }); // Por ejemplo, renderiza la vista 'editAlumno.ejs' y pasa el ID del alumno
});


module.exports = router; // Exporta el objeto router
