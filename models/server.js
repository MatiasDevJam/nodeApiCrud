const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

//POO
//Creamos una clase, un contructor, creamos sus metodos y propiedades

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación

        this.routes();
    }

    //Conectamos a la base de datos de datos de manera asincrona
    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Acceso a la carpeta public
        this.app.use(express.static('public'));
    }

    //llamamos a el archivo user para que se encargue de las rutas
    routes() {
    this.app.use(this.authPath, require('../routes/authRouter'));
       this.app.use(this.usuariosPath, require('../routes/usuariosRouter'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server running at port', this.port)
        })
    }

}

module.exports = Server;