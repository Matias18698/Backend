const fs = require('fs');
const PDFDocument = require('pdfkit-table')

const Asamblea = require('../models/asamblea');

const { v4: uuidv4 } = require('uuid');

const  createTable=async(req,res) =>{
  // Se crea la instancia del pdf
  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  const { id } = req.params;
  const asambleaAlumnos =   await Asamblea.findById(id).populate('alumnos');

  // Si no se encuentra la asamblea, se envía un mensaje de error
  if (!asambleaAlumnos) {
    return res.status(404).send({ message: 'No se encontró la asamblea' });
  }
  asistentes = asambleaAlumnos.alumnos;
 
  
  // console.log(asambleaAlumnos);
 
  // console.log(asambleaAlumnos);

  // Generar un nombre de archivo aleatorio
  const randomFileName = uuidv4();
  const filePath = `./Pdf/${randomFileName}.pdf`;

  // pipe the document to a writable stream
  doc.pipe(fs.createWriteStream(filePath));

  // Se define el contenido de la tabla
  const table = {
    title: {label: 'Asistentes a asamblea', color: 'blue'},
    headers: ['Alumno', 'Email'], // Cambié los nombres de las columnas
    rows: []
  };

  // iterate over each report and extract values into the table rows
 
  asistentes.forEach((asistente, indice) => {
    const rowData = [asistente.nombre + ' ' + asistente.apellido, asistente.correo]; 
    table.rows.push(rowData);
  });



  // draw the table
   doc.table(table, { startY: 50 });

  // Agregar imagen al documento
//   const imagePath = './src/images/report.png'; // Ruta de la imagen que deseas agregar
//   doc.image(imagePath, 200, 300, { width: 200 }); // Ajusta las coordenadas y el tamaño según sea necesario

  // end the document
  doc.end();

  return res.status(200).send({ message: "Reporte generado con éxito" }) // Retorna el nombre del archivo generado, en caso de tener que usar el nombre del archivo para enviar por correo
}

module.exports = {
    createTable
}