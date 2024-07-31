const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

const votacionRoutes = require('./routes/votacionRoutes');
const alumnoRoutes = require('./routes/alumnoRoutes');
const asambleaRoutes = require('./routes/asambleaRoutes');
const carreraRoutes = require('./routes/carreraRoutes');
const userRoutes = require('./routes/userRoutes');

const path = require('path'); // Asegúrate de importar el módulo 'path' para manejar rutas de archivos

// Middleware para indicar a Express dónde están las vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Configura el motor de plantillas como EJS

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());


app.use(cors());
app.use(express.json());
app.options('*', cors());
app.use('/api', votacionRoutes);
app.use('/api', alumnoRoutes);
app.use('/api', asambleaRoutes);
app.use('/api', carreraRoutes);
app.use('/api', userRoutes);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.URI, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Connected to database");
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})
