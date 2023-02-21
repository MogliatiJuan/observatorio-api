const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const multer = require('multer');
const { uuid } = require('uuidv4');
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.').slice(0, -1).join('.') + '__' + uuid() + path.extname(file.originalname));
    }
})
var cors = require('cors');
//Importando rutas
const fallo_router = require('./modules/fallos/router_fallos');
const varios_router = require('./modules/varios/router_varios');
//Setting
app.set('port', process.env.PORT || 3000);
//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(myConnection(mysql, {
    host: '192.168.1.160',
    user: 'observador',
    password: 'nolose123',
    port: 3306,
    database: 'dev_mysql_observatorio'
}, 'single'));
app.use(express.urlencoded({ extends: false })); //permite entender los datos que vienen de formulario
app.use(express.json()); //escucho jsons

// static files
app.use(express.static(__dirname + '/public'));
app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads') //probablemente halla que sacarlo por recplicacion
}).single('archivoupload')); //escucho jsons

//Routes
app.use('/api/fallo',fallo_router);
app.use('/api/varios', varios_router);


//Iniciando el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor activo en puerto 3000');
});